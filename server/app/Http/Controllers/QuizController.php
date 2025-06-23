<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\UserAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all available quizzes
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $quizzes = Quiz::where('is_active', true)
            ->withCount('questions')
            ->get();

        return response()->json($quizzes);
    }

    /**
     * Get a specific quiz with its questions and options
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $quiz = Quiz::with(['questions.options'])
            ->where('is_active', true)
            ->find($id);

        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }

        return response()->json($quiz);
    }

    /**
     * Start a new quiz attempt
     * 
     * @param Request $request
     * @param int $quizId
     * @return \Illuminate\Http\JsonResponse
     */
    public function startQuiz(Request $request, $quizId)
    {
        $quiz = Quiz::where('is_active', true)->find($quizId);

        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }

        // Check if user has an incomplete attempt for this quiz
        $existingAttempt = QuizAttempt::where('user_id', Auth::id())
            ->where('quiz_id', $quizId)
            ->whereNull('completed_at')
            ->first();

        if ($existingAttempt) {
            return response()->json([
                'message' => 'You have an incomplete attempt for this quiz',
                'attempt_id' => $existingAttempt->id
            ], 400);
        }

        $attempt = QuizAttempt::create([
            'user_id' => Auth::id(),
            'quiz_id' => $quizId,
            'started_at' => now(),
            'total_questions' => $quiz->questions()->count()
        ]);

        return response()->json([
            'message' => 'Quiz started successfully',
            'attempt_id' => $attempt->id,
            'quiz' => $quiz->load(['questions.options'])
        ]);
    }

    /**
     * Submit an answer for a specific question
     * 
     * @param Request $request
     * @param int $attemptId
     * @return \Illuminate\Http\JsonResponse
     */
    public function submitAnswer(Request $request, $attemptId)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_option_id' => 'required|exists:question_options,id'
        ]);

        $attempt = QuizAttempt::where('id', $attemptId)
            ->where('user_id', Auth::id())
            ->whereNull('completed_at')
            ->first();

        if (!$attempt) {
            return response()->json(['message' => 'Quiz attempt not found or already completed'], 404);
        }

        // Check if question belongs to this quiz
        $question = $attempt->quiz->questions()
            ->where('id', $request->question_id)
            ->first();

        if (!$question) {
            return response()->json(['message' => 'Question does not belong to this quiz'], 400);
        }

        // Check if option belongs to this question
        $selectedOption = $question->options()
            ->where('id', $request->selected_option_id)
            ->first();

        if (!$selectedOption) {
            return response()->json(['message' => 'Option does not belong to this question'], 400);
        }

        // Check if user already answered this question in this attempt
        $existingAnswer = UserAnswer::where('quiz_attempt_id', $attemptId)
            ->where('question_id', $request->question_id)
            ->first();

        if ($existingAnswer) {
            // Update existing answer
            $existingAnswer->update([
                'selected_option_id' => $request->selected_option_id,
                'is_correct' => $selectedOption->is_correct
            ]);
            $userAnswer = $existingAnswer;
        } else {
            // Create new answer
            $userAnswer = UserAnswer::create([
                'quiz_attempt_id' => $attemptId,
                'question_id' => $request->question_id,
                'selected_option_id' => $request->selected_option_id,
                'is_correct' => $selectedOption->is_correct
            ]);
        }

        return response()->json([
            'message' => 'Answer submitted successfully',
            'is_correct' => $userAnswer->is_correct
        ]);
    }

    /**
     * Complete the quiz and calculate final score
     * 
     * @param Request $request
     * @param int $attemptId
     * @return \Illuminate\Http\JsonResponse
     */
    public function completeQuiz(Request $request, $attemptId)
    {
        $attempt = QuizAttempt::where('id', $attemptId)
            ->where('user_id', Auth::id())
            ->whereNull('completed_at')
            ->first();

        if (!$attempt) {
            return response()->json(['message' => 'Quiz attempt not found or already completed'], 404);
        }

        // Check if all questions are answered
        $totalQuestions = $attempt->total_questions;
        $answeredQuestions = $attempt->userAnswers()->count();

        if ($answeredQuestions < $totalQuestions) {
            return response()->json([
                'message' => 'Please answer all questions before completing the quiz',
                'answered' => $answeredQuestions,
                'total' => $totalQuestions
            ], 400);
        }

        // Calculate score and complete the attempt
        $score = $attempt->calculateScore();
        $attempt->update(['completed_at' => now()]);

        return response()->json([
            'message' => 'Quiz completed successfully',
            'attempt_id' => $attempt->id,
            'score' => $score,
            'total_questions' => $totalQuestions
        ]);
    }

    /**
     * Get results for a completed quiz attempt
     * 
     * @param int $attemptId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getResults($attemptId)
    {
        $attempt = QuizAttempt::with([
            'quiz',
            'userAnswers.question.options',
            'userAnswers.selectedOption'
        ])
        ->where('id', $attemptId)
        ->where('user_id', Auth::id())
        ->whereNotNull('completed_at')
        ->first();

        if (!$attempt) {
            return response()->json(['message' => 'Quiz results not found or quiz not completed'], 404);
        }

        // Format the results
        $results = [
            'attempt_id' => $attempt->id,
            'quiz' => [
                'id' => $attempt->quiz->id,
                'title' => $attempt->quiz->title,
                'topic' => $attempt->quiz->topic
            ],
            'score' => $attempt->score,
            'total_questions' => $attempt->total_questions,
            'completed_at' => $attempt->completed_at,
            'questions' => []
        ];

        foreach ($attempt->userAnswers as $userAnswer) {
            $question = $userAnswer->question;
            $correctOption = $question->options->where('is_correct', true)->first();

            $results['questions'][] = [
                'question_id' => $question->id,
                'question_text' => $question->question_text,
                'question_order' => $question->question_order,
                'options' => $question->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'option_letter' => $option->option_letter,
                        'option_text' => $option->option_text,
                        'is_correct' => $option->is_correct
                    ];
                }),
                'user_answer' => [
                    'selected_option_id' => $userAnswer->selected_option_id,
                    'selected_option_letter' => $userAnswer->selectedOption->option_letter,
                    'selected_option_text' => $userAnswer->selectedOption->option_text,
                    'is_correct' => $userAnswer->is_correct
                ],
                'correct_answer' => [
                    'option_id' => $correctOption->id,
                    'option_letter' => $correctOption->option_letter,
                    'option_text' => $correctOption->option_text
                ]
            ];
        }

        // Sort questions by order
        $results['questions'] = collect($results['questions'])->sortBy('question_order')->values()->all();

        return response()->json($results);
    }

    /**
     * Get current quiz attempt status
     * 
     * @param int $attemptId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAttemptStatus($attemptId)
    {
        $attempt = QuizAttempt::with(['userAnswers'])
            ->where('id', $attemptId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$attempt) {
            return response()->json(['message' => 'Quiz attempt not found'], 404);
        }

        $answeredQuestions = $attempt->userAnswers->pluck('question_id')->toArray();

        return response()->json([
            'attempt_id' => $attempt->id,
            'quiz_id' => $attempt->quiz_id,
            'is_completed' => $attempt->isCompleted(),
            'answered_questions' => $answeredQuestions,
            'total_questions' => $attempt->total_questions,
            'started_at' => $attempt->started_at,
            'completed_at' => $attempt->completed_at
        ]);
    }
}