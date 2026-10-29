@module:about-us @sheet:AU @area:public
Feature: About Us — constitutional mandate, leadership structure and governance hierarchy
  As a citizen or external researcher navigating the national audit institution portal
  I want comprehensive access to the Comptroller and Auditor General constitutional mandate and hierarchy
  So that institutional governance, historical leadership, and organisational divisions are transparent

  Background:
    Given I navigate to the public About Us landing page

  Rule: Sub-category directory taxonomy and navigation reachability

    @TC:AU-01 @smoke @priority:high @type:functional
    Scenario: [AU-01] Navigating to the About Us landing page displays all eleven official subcategory navigation links
      Then the page displays all 11 official About Us sub-category links
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AU-02 @regression @priority:high @type:functional
    Scenario Outline: [AU-02] Selecting individual About Us subcategories loads the corresponding institutional section successfully
      When I select the sub-category link "<slug>"
      Then the corresponding sub-category section should load successfully
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

      Examples:
        | slug                    |
        | constitutional-mandate  |
        | dpc-act                 |
        | organisation-structure  |

    @TC:AU-09 @TC:AU-10 @regression @priority:medium @type:functional
    Scenario: [AU-09, AU-10] Direct URL navigation to institutional subpages renders valid page content with accurate breadcrumb navigation trails
      Given I navigate to an About Us sub-page via direct URL "mandate"
      Then the sub-page content should render with proper breadcrumbs
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

  Rule: Organisation tree hierarchy, API synchronization and interactive nodes

    @TC:AU-06 @regression @priority:high @type:integration
    Scenario: [AU-06] The visual leadership tree renders administrative hierarchy matching the active organisation chart API endpoint payload
      Given I view the organisation structure officer tree
      Then the displayed officer hierarchy matches the organisation chart API response
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AU-11 @regression @priority:medium @type:ui
    Scenario: [AU-11] Hovering over administrative leadership nodes displays detailed tenure tooltips positioned without viewport clipping
      When I hover over the primary leadership node
      Then the node details tooltip should display without screen clipping
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors
