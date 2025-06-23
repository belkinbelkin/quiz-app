<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Acceleration Quiz (10 questions - matching screenshots)
        $quizId = DB::table('quizzes')->insertGetId([
            'title' => 'Test Quiz',
            'description' => 'Test your knowledge of acceleration and physics concepts',
            'topic' => 'Acceleration',
            'image_url' => null,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $questions = [
            [
                'question_text' => 'What does speed measure?',
                'options' => [
                    ['text' => 'How fast an object is going', 'letter' => 'A', 'correct' => true],
                    ['text' => 'How far an object has traveled', 'letter' => 'B', 'correct' => false],
                    ['text' => 'The rate at which an object slows down', 'letter' => 'C', 'correct' => false],
                    ['text' => 'The rate at which an object speeds up', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'Which of the following can be used to measure an object\'s speed?',
                'options' => [
                    ['text' => 'Joules', 'letter' => 'A', 'correct' => false],
                    ['text' => 'Newtons', 'letter' => 'B', 'correct' => false],
                    ['text' => 'Miles per hour', 'letter' => 'C', 'correct' => true],
                    ['text' => 'Kilometers per second per second', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What is acceleration?',
                'options' => [
                    ['text' => 'The distance an object travels', 'letter' => 'A', 'correct' => false],
                    ['text' => 'The speed of an object', 'letter' => 'B', 'correct' => false],
                    ['text' => 'The change in velocity over time', 'letter' => 'C', 'correct' => true],
                    ['text' => 'The force applied to an object', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'Which unit is used to measure acceleration?',
                'options' => [
                    ['text' => 'meters per second', 'letter' => 'A', 'correct' => false],
                    ['text' => 'meters per second squared', 'letter' => 'B', 'correct' => true],
                    ['text' => 'kilometers per hour', 'letter' => 'C', 'correct' => false],
                    ['text' => 'newtons', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'Which of these is an example of acceleration?',
                'options' => [
                    ['text' => 'A car coasts along at 40 km/hr', 'letter' => 'A', 'correct' => false],
                    ['text' => 'A car is parked on the side of the road', 'letter' => 'B', 'correct' => false],
                    ['text' => 'A speeding car brakes to a stop', 'letter' => 'C', 'correct' => true],
                    ['text' => 'A car speeds along at 100 km/hr', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What happens when an object accelerates?',
                'options' => [
                    ['text' => 'Its velocity changes', 'letter' => 'A', 'correct' => true],
                    ['text' => 'Its mass increases', 'letter' => 'B', 'correct' => false],
                    ['text' => 'Its weight decreases', 'letter' => 'C', 'correct' => false],
                    ['text' => 'Its temperature rises', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'Which statement about acceleration is true?',
                'options' => [
                    ['text' => 'Acceleration only occurs when speeding up', 'letter' => 'A', 'correct' => false],
                    ['text' => 'Acceleration can be positive or negative', 'letter' => 'B', 'correct' => true],
                    ['text' => 'Acceleration is the same as velocity', 'letter' => 'C', 'correct' => false],
                    ['text' => 'Acceleration cannot occur without friction', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What is deceleration?',
                'options' => [
                    ['text' => 'Speeding up', 'letter' => 'A', 'correct' => false],
                    ['text' => 'Negative acceleration', 'letter' => 'B', 'correct' => true],
                    ['text' => 'Constant velocity', 'letter' => 'C', 'correct' => false],
                    ['text' => 'Zero acceleration', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'If a car goes from 0 to 60 mph in 10 seconds, what is happening?',
                'options' => [
                    ['text' => 'The car is decelerating', 'letter' => 'A', 'correct' => false],
                    ['text' => 'The car is accelerating', 'letter' => 'B', 'correct' => true],
                    ['text' => 'The car has constant velocity', 'letter' => 'C', 'correct' => false],
                    ['text' => 'The car is not moving', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What force causes acceleration according to Newton\'s second law?',
                'options' => [
                    ['text' => 'Gravitational force only', 'letter' => 'A', 'correct' => false],
                    ['text' => 'Friction force only', 'letter' => 'B', 'correct' => false],
                    ['text' => 'Net force', 'letter' => 'C', 'correct' => true],
                    ['text' => 'Magnetic force only', 'letter' => 'D', 'correct' => false],
                ]
            ]
        ];

        foreach ($questions as $index => $questionData) {
            $questionId = DB::table('questions')->insertGetId([
                'quiz_id' => $quizId,
                'question_text' => $questionData['question_text'],
                'question_order' => $index + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($questionData['options'] as $option) {
                DB::table('question_options')->insert([
                    'question_id' => $questionId,
                    'option_text' => $option['text'],
                    'option_letter' => $option['letter'],
                    'is_correct' => $option['correct'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Create a shorter quiz for testing flexibility (5 questions)
        $shortQuizId = DB::table('quizzes')->insertGetId([
            'title' => 'Basic Physics Quiz',
            'description' => 'A shorter quiz on basic physics concepts',
            'topic' => 'Basic Physics',
            'image_url' => null,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $shortQuestions = [
            [
                'question_text' => 'What is the unit of force?',
                'options' => [
                    ['text' => 'Joule', 'letter' => 'A', 'correct' => false],
                    ['text' => 'Newton', 'letter' => 'B', 'correct' => true],
                    ['text' => 'Watt', 'letter' => 'C', 'correct' => false],
                    ['text' => 'Pascal', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What is the speed of light in vacuum?',
                'options' => [
                    ['text' => '300,000 km/s', 'letter' => 'A', 'correct' => true],
                    ['text' => '150,000 km/s', 'letter' => 'B', 'correct' => false],
                    ['text' => '600,000 km/s', 'letter' => 'C', 'correct' => false],
                    ['text' => '200,000 km/s', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What is gravity on Earth approximately?',
                'options' => [
                    ['text' => '8.8 m/s²', 'letter' => 'A', 'correct' => false],
                    ['text' => '9.8 m/s²', 'letter' => 'B', 'correct' => true],
                    ['text' => '10.8 m/s²', 'letter' => 'C', 'correct' => false],
                    ['text' => '11.8 m/s²', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What is energy?',
                'options' => [
                    ['text' => 'The ability to do work', 'letter' => 'A', 'correct' => true],
                    ['text' => 'The amount of matter', 'letter' => 'B', 'correct' => false],
                    ['text' => 'The resistance to motion', 'letter' => 'C', 'correct' => false],
                    ['text' => 'The speed of an object', 'letter' => 'D', 'correct' => false],
                ]
            ],
            [
                'question_text' => 'What law states that energy cannot be created or destroyed?',
                'options' => [
                    ['text' => 'Newton\'s First Law', 'letter' => 'A', 'correct' => false],
                    ['text' => 'Law of Universal Gravitation', 'letter' => 'B', 'correct' => false],
                    ['text' => 'Conservation of Energy', 'letter' => 'C', 'correct' => true],
                    ['text' => 'Law of Thermodynamics', 'letter' => 'D', 'correct' => false],
                ]
            ]
        ];

        foreach ($shortQuestions as $index => $questionData) {
            $questionId = DB::table('questions')->insertGetId([
                'quiz_id' => $shortQuizId,
                'question_text' => $questionData['question_text'],
                'question_order' => $index + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($questionData['options'] as $option) {
                DB::table('question_options')->insert([
                    'question_id' => $questionId,
                    'option_text' => $option['text'],
                    'option_letter' => $option['letter'],
                    'is_correct' => $option['correct'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}