<?php

namespace App\Repositories\Interfaces;

interface AuthRepositoryInterface
{
    /**
     * Find a user by their email address.
     */
    public function findUserByEmail(string $email): ?object;

    /**
     * Create a new organization and user within a transaction.
     * Returns the newly created User ID.
     */
    public function createUserAndOrganization(array $userData, string $orgName): ?int;
}
