using Framework.Core.BDD;
using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Framework.Core.ScreenPlay.Interactions;
using Framework.Core.ScreenPlay.Questions;
using Framework.Core.ScreenPlay.Tasks;
using Microsoft.Playwright;
using Reqnroll;
using Scaffolding.Tests.POM.Google.Actions;

namespace Scaffolding.Tests.BDD.Steps;

/// <summary>
/// Step definitions for Google Search feature.
/// Steps ONLY call Tasks or Questions - ZERO validation logic in steps.
/// All validation logic is encapsulated in VerificationQuestions.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="GoogleSearchSteps"/> class.
/// </remarks>
/// <param name="scenarioContext">The scenario context.</param>
[Binding]
public class GoogleSearchSteps(ScenarioContext scenarioContext)
{
    private readonly ScenarioContext _scenarioContext = scenarioContext;

    /// <summary>
    /// Gets the actor from the scenario context.
    /// </summary>
    private IActor Actor => ScenarioActor.Get(_scenarioContext);

    /// <summary>
    /// Step: Given the user is on the Google home page.
    /// Pure action - no validation.
    /// </summary>
    [Given("the user is on the Google home page")]
    public Task GivenTheActorIsOnTheGoogleHomePage() 
        => Actor.AttemptsToAsync(NavigateToUrl.To("https://www.google.com", "networkidle"));

    /// <summary>
    /// Step: When they search for a query.
    /// Pure action - no validation.
    /// </summary>
    [When("they search for {string}")]
    public Task WhenTheySearchFor(string query) 
        => Actor.AttemptsToAsync(GoogleHomePageActions.SearchFor(query));

    /// <summary>
    /// Step: Then the search should execute without errors.
    /// VerificationQuestion encapsulates ALL validation logic.
    /// </summary>
    [Then("the search should execute without errors")]
    public Task ThenTheSearchShouldExecuteWithoutErrors() 
        => Actor.AsksForAsync(VerifyContainsText.Text("/search", "URL should contain '/search' after search"));

    /// <summary>
    /// Step: Then I should see search results.
    /// VerificationQuestion encapsulates ALL validation logic.
    /// </summary>
    [Then("I should see search results")]
    public Task ThenIShouldSeeSearchResults() 
        => Actor.AsksForAsync(VerifyTrue.That(async () 
            => await IsElementVisible.Element("[id='search']").AnsweredByAsync(Actor), "Search should return results"));

    /// <summary>
    /// Step: Then the search results count should be greater than minimum.
    /// VerificationQuestion encapsulates ALL validation logic.
    /// </summary>
    [Then("the search results count should be greater than {int}")]
    public Task ThenSearchResultsCountShouldBeGreaterThan(int minValue) 
        => Actor.AsksForAsync(VerifyGreaterThan.Value(async () => await GetElementCount.Of("[id='search']").AnsweredByAsync(Actor), minValue, $"Search results count should be greater than {minValue}"));
}
