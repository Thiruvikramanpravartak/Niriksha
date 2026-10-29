@module:our-presence @sheet:OP @area:public
Feature: Our Presence — nationwide field audit offices, state directorates and training institutes
  As a citizen, state government representative, or auditor exploring the CAG operational footprint
  I want a clear directory of central audit offices, state accountant general offices, and training centres
  So that nationwide audit oversight locations and regional contact directorates are easily discoverable

  Background:
    Given I navigate to the Our Presence section

  Rule: Field offices and regional directorates directory listings

    @TC:OP-04 @regression @priority:high @type:functional
    Scenario: [OP-04] The Central Audit Offices directory lists all central expenditure, railway, and defence audit directorates
      Then the Central Audit Offices list displays all central-level directorates
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:OP-05 @regression @priority:high @type:functional
    Scenario: [OP-05] The State-Level Offices directory lists all State Accountant General audit and accounts offices nationwide
      Then the State-Level Offices section lists Accountant General offices accurately
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:OP-06 @regression @priority:medium @type:functional
    Scenario: [OP-06] The Training Institutes directory displays the National Academy of Audit and Accounts alongside regional training centres
      Then the Training Institutes section lists NAAA and regional training centres
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

  Rule: Sub-navigation reachability and regional routing

    @TC:OP-07 @smoke @priority:high @type:functional
    Scenario: [OP-07] Navigating the Our Presence section menu confirms all four primary subpages are reachable and render valid content
      When I check the Our Presence sub-navigation menu
      Then all four sub-pages are reachable and render valid content
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors
