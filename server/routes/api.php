<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\Auth\TokenController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication
Route::post('login', [TokenController::class, 'login']);

// Protected Quiz Routes
Route::middleware('auth:sanctum')->group(function () {
    // Get all available quizzes
    Route::get('quizzes', [QuizController::class, 'index']);
    
    // Get specific quiz details
    Route::get('quiz/{id}', [QuizController::class, 'show']);
    
    // Start a quiz attempt
    Route::post('quiz/{id}/start', [QuizController::class, 'startQuiz']);
    
    // Submit answer for a question
    Route::post('quiz-attempt/{id}/answer', [QuizController::class, 'submitAnswer']);
    
    // Complete the quiz
    Route::post('quiz-attempt/{id}/complete', [QuizController::class, 'completeQuiz']);
    
    // Get quiz results
    Route::get('quiz-attempt/{id}/results', [QuizController::class, 'getResults']);
    
    // Get attempt status (for checking progress)
    Route::get('quiz-attempt/{id}/status', [QuizController::class, 'getAttemptStatus']);
});