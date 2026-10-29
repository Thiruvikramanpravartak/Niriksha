@ui @smoke
Feature: Template Smoke Verification
  As a QA engineer onboarding a new project
  I want a runnable smoke scenario
  So that I can verify project plumbing in minutes

  @TC:TMPL-01
  Scenario: [TMPL-01] Verify that template landing page renders all core header components and structural elements
    Given I navigate to the example page
    Then the example page title should be visible
    And the example page content container should be rendered
    And probe health check confirms the page DOM hierarchy is stable
