<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_order'
    ];

    /**
     * Get the quiz that owns this question.
     */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the options for this question.
     */
    public function options()
    {
        return $this->hasMany(QuestionOption::class)->orderBy('option_letter');
    }

    /**
     * Get the correct option for this question.
     */
    public function correctOption()
    {
        return $this->hasOne(QuestionOption::class)->where('is_correct', true);
    }

    /**
     * Get the user answers for this question.
     */
    public function userAnswers()
    {
        return $this->hasMany(UserAnswer::class);
    }
}