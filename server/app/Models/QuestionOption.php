<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'option_text',
        'option_letter',
        'is_correct'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /**
     * Get the question that owns this option.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Get the user answers that selected this option.
     */
    public function userAnswers()
    {
        return $this->hasMany(UserAnswer::class, 'selected_option_id');
    }
}