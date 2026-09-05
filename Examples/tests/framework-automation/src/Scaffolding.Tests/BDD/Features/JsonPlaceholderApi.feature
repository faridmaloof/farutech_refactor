Feature: JSONPlaceholder API
  As an API client
  I want to interact with the JSONPlaceholder API
  So that I can verify the API functionality

  @api @smoke
  Scenario: Get posts from API
    Given the API is available
    When I request all posts
    Then I should receive a list of posts
    And the first post should have an ID

  @api @posts
  Scenario: Get single post
    Given the API is available
    When I request post with id 1
    Then I should receive the post details
    And the post title should not be empty

  @api @users
  Scenario: Get users from API
    Given the API is available
    When I request all users
    Then I should receive a list of users
    And the first user should have an email
