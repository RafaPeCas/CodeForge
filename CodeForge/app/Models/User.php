<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Auth\User as Authenticatable;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\BSON\ObjectId;

class User extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
    * The attributes that are mass assignable.
    *
    * @var list<string>
    */
    protected $collection = 'users';
    protected $fillable = [
        'username',
        'email',
        'password',
        'spaces',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function addSpace(User $user, string $role = 'read_only')
    {
        $this->push('spaces', [
            'id' => new ObjectId($space->_id),
            'name' => $role,
        ]);
    }

    public function addNotebook(Notebook $notebook)
    {
        $this->push('notebooks', [
            'id' => new ObjectId($notebook->_id),
            'name' => $notebook->name,
        ]);
    }

}
