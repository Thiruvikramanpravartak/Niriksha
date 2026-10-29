@ui @regression @module:ux @sheet:UX @area:public
Feature: Shared UI Components, Navigation and Breadcrumbs
  As a visitor
  I want standard navigation, headers, footers, and breadcrumbs
  So that I can easily orient myself and navigate the CAG website

  Rule: Global header, footer and accessibility controls

    @TC:UX-01 @TC:UX-05 @regression @priority:high @type:ui
    Scenario: [UX-01, UX-05] Site header and footer render national emblem, portal title, and verified legal disclaimers without layout shift
      Given I navigate to the home page
      Then the common header should contain the emblem and portal title
      And the common footer should contain the copyright and policy links
      And the page records no console errors

    @TC:UX-02 @regression @priority:high @type:ui
    Scenario: [UX-02] Accessibility utility bar renders text-sizing toggles and high-contrast controls on all public templates
      Given I navigate to the home page
      Then the utility bar should provide text sizing and accessibility toggles
      And the common header should contain the emblem and portal title
      And the page records no console errors

    @TC:UX-06 @regression @priority:medium @type:functional
    Scenario: [UX-06] Comprehensive portal footer provides accessible navigational links to official policies, citizen charter, and RTI disclosures
      Given I navigate to the home page
      Then the footer should contain RTI and official policy links
      And the common footer should contain the copyright and policy links
      And the page records no console errors

  Rule: Primary and responsive navigation bars

    @TC:UX-03 @smoke @priority:high @type:functional
    Scenario: [UX-03] Top navigation bar renders the primary five menu links in canonical order across all public screens
      Given I navigate to the home page
      Then the main navigation should contain 5 items in the specified order
      And the common header should contain the emblem and portal title
      And the page records no console errors

    @TC:UX-04 @regression @priority:medium @type:ui
    Scenario: [UX-04] Responsive viewport renders mobile hamburger navigation trigger and reveals accessible slide-out navigation links
      Given I navigate to the home page with mobile viewport
      Then the mobile navigation menu should be accessible
      And the common header should contain the emblem and portal title
      And the page records no console errors

  Rule: Contextual breadcrumb hierarchy and home linkage

    @TC:UX-07 @smoke @priority:medium @type:ui
    Scenario: [UX-07] Contextual breadcrumb navigation trail updates dynamically to reflect parent-child page hierarchy without broken trail links
      Given I navigate to the reports page
      Then the breadcrumb should display the home and current page trail
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:UX-08 @regression @priority:low @type:functional
    Scenario: [UX-08] Breadcrumb home link navigates back to the root landing page from any nested inner screen
      Given I navigate to the reports page
      When I select the home link in the breadcrumb trail
      Then I should be returned to the home page
      And the common header should contain the emblem and portal title
      And the page records no console errors
