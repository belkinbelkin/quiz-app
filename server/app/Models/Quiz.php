<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'topic',
        'image_url',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the questions for this quiz.
     */
    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('question_order');
    }

    /**
     * Get the quiz attempts for this quiz.
     */
    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get the total number of questions for this quiz.
     */
    public function getTotalQuestionsAttribute()
    {
        return $this->questions()->count();
    }
}