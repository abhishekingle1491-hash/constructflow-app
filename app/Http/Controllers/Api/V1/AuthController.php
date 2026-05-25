<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Jobs\SendWelcomeEmail;
// 1. Import the INTERFACE, not the concrete class
use App\Repositories\Interfaces\AuthRepositoryInterface;

class AuthController extends Controller
{
    //private AuthRepositoryInterface $authRepository;

    public function __construct(private AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        $userId = $this->authRepository->createUserAndOrganization($validated, $validated['organization_name']);

        if (!$userId) {
            return response()->json('Cannot create user', 500);
        }

        // 2. DISPATCH THE JOB: This returns control to the user instantly
        $user = User::find($userId);
        SendWelcomeEmail::dispatch($user->toArray());

        Auth::login(User::find($userId));
        $request->session()->regenerate();

        //return response()->json(Auth::user(), 201);
        return response()->json(new UserResource(Auth::user()), 201);
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $request->session()->regenerate();
        //return response()->json(Auth::user());
        return response()->json(new UserResource(Auth::user()), 201);
    }

    public function logout(Request $request)
    {
        // Use the web guard for session-based logout
        Auth::guard('web')->logout();

        // Invalidate the session and regenerate the CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Return 204 No Content for SPA compatibility
        return response()->noContent();
    }
}