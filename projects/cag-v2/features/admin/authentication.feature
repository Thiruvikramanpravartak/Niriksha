@ui @regression @module:auth @sheet:AA @area:admin
Feature: Admin Portal Authentication and Authorization
  As a CAG officer
  I want secure administrative authentication
  So that unauthorized access to the CMS is blocked

  Rule: Credential authentication and session establishment

    @TC:AA-01 @smoke @priority:high @type:functional
    Scenario: [AA-01] Authenticating with valid administrator credentials succeeds and redirects the user to the administrative dashboard
      Given I am on the admin login page
      When I submit valid admin credentials
      Then I should be redirected to the admin dashboard
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AA-02 @smoke @priority:high @type:security
    Scenario: [AA-02] Logging in with a valid username and an incorrect password is rejected and creates no session
      Given I am on the admin login page
      When I submit invalid admin credentials
      Then an authentication error should be displayed
      And the page returns no 5xx response
      And the page records no console errors

    @TC:AA-03 @regression @priority:high @type:security
    Scenario: [AA-03] Submitting empty authentication credentials triggers client-side required field validations without exposing system stack traces
      Given I am on the admin login page
      When I submit the login form without entering credentials
      Then required validation messages for username and password should appear
      And the page returns no 5xx response
      And the page records no console errors

  Rule: Session persistence, lifecycle and revocation

    @TC:AA-04 @TC:AA-07 @regression @priority:high @type:security
    Scenario: [AA-04, AA-07] Executing the administrator logout action terminates the user session and redirects back to the login page
      Given I am logged in as an administrator on the dashboard
      When I log out of the admin portal
      Then my session should be terminated and I should be redirected to the login page
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AA-05 @regression @priority:medium @type:security
    Scenario: [AA-05] Selecting the remember-me login option maintains active administrator authentication across subsequent browser reloads
      Given I am on the admin login page
      When I log in with remember me enabled
      Then the session should persist across browser reloads
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

  Rule: Protected route access control and authorization barriers

    @TC:AA-06 @smoke @priority:high @type:security
    Scenario: [AA-06] Unauthenticated direct access to protected administrative routes redirects the user immediately to the login form
      Given I am an unauthenticated user
      When I attempt to visit the admin dashboard directly
      Then I should be redirected to the admin login page
      And the page returns no 5xx response
      And the page records no console errors
