@ui @regression @module:home @sheet:HP @area:public
Feature: Public Home Portal — National Audit Portal Landing
  As a citizen
  I want to access the CAG national portal
  So that I can view verified audit statistics, hero overview, and assets

  Background:
    Given I navigate to the home page

  Rule: Hero overview and dynamic audit statistics

    @TC:HP-01 @TC:HP-09 @smoke @priority:high @type:ui
    Scenario: [HP-01, HP-09] Home page loads its hero banner and all page assets with no broken images or missing resources
      Then the hero section should be visible
      And the stats section should be visible
      And there should be no broken image assets on the page
      And the page records no console errors

    @TC:HP-02 @smoke @priority:high @type:functional
    Scenario: [HP-02] Home portal statistics counters render dynamically and match published audit figures from the summary API
      When I fetch the home summary from the API
      Then the displayed report and office counts should match the API figures
      And the stats section should be visible
      And the page records no console errors

  Rule: Global branding and portal navigation

    @TC:HP-03 @regression @priority:medium @type:functional
    Scenario: [HP-03] National portal header renders the official Ashoka emblem and bilingual Comptroller title without layout shift
      Then the official national emblem logo should be displayed in the header
      And the hero section should be visible
      And the page records no console errors

    @TC:HP-04 @regression @priority:medium @type:functional
    Scenario: [HP-04] Site footer renders copyright notices, official government linkages, and accessible policy disclaimers across viewports
      Then the footer should display copyright and official government portal links
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

  Rule: Announcements, highlights and quick discovery

    @TC:HP-05 @smoke @priority:high @type:functional
    Scenario: [HP-05] Latest published audit reports cards render on the home page and provide direct navigational links
      Then the latest audit reports highlights should be visible on the home page
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:HP-06 @regression @priority:high @type:ui
    Scenario: [HP-06] Important news announcements ticker renders on the home page without overlapping visual elements or text truncation
      Then the home announcements or news ticker widget should be present
      And the hero section should be visible
      And the page records no console errors

    @TC:HP-07 @regression @priority:high @type:localization
    Scenario: [HP-07] Quick search trigger accepts citizen query terms and seamlessly transitions to the filtered reports browser
      When I use the quick search bar on the home page
      Then it should accept input and initiate navigation to reports search
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors
