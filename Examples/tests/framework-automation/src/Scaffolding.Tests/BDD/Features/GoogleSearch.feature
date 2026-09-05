Feature: Google Search
  As a user
  I want to search for concepts in Google
  So that I can find relevant information

  @smoke @web
  Scenario: Search executes successfully
    Given the user is on the Google home page
    When they search for "Playwright .NET"
    Then the search should execute without errors
