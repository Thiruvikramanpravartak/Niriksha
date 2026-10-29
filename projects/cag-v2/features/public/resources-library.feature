@module:resources-library @sheet:RL @area:public
Feature: Resources and Library — statutory enactments, audit manuals, active tenders and departmental circulars
  As a government official, contractor, or researcher accessing institutional resources
  I want a structured digital library of acts, operational manuals, active procurements, and circulars
  So that statutory documents and current administrative notices are easily accessible and verifiable

  Background:
    Given I navigate to the Resources and Library portal

  Rule: Resource categorization and official documentation collections

    @TC:RL-01 @smoke @priority:high @type:functional
    Scenario: [RL-01] The Resources and Library landing page displays all four primary statutory and administrative documentation categories
      Then the page displays all four primary resource categories
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:RL-02 @regression @priority:medium @type:functional
    Scenario: [RL-02] Navigating into specific resource collections presents associated published operational manuals and statutory guidelines
      When I inspect each category collection
      Then each category section presents its published documents correctly
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

  Rule: Departmental procurement notices and administrative circular records

    @TC:RL-04 @regression @priority:medium @type:functional
    Scenario: [RL-04] The active departmental tenders table displays current procurement notices with valid tender identification numbers and dates
      When I view the active departmental tenders table
      Then current tender notices are displayed with valid IDs and dates
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:RL-05 @regression @priority:medium @type:functional
    Scenario: [RL-05] The departmental circulars table displays published administrative notifications with valid subjects and release dates
      When I view the departmental circulars table
      Then published administrative circulars are listed with subject and date
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors
