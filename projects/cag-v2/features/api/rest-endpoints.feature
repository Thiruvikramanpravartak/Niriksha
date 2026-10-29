@api @regression @module:api @sheet:API @area:api
Feature: CAG National Audit Portal Core REST API Endpoints
  As an API client or public application consumer
  I want to query validated REST API endpoints
  So that structured audit data, reports, news, and governance records are served accurately

  Rule: Public content and overview API endpoints

    @TC:API-01 @smoke @priority:high @type:api
    Scenario: [API-01] GET /api/home returns HTTP 200 with hero overview and audit statistics payload
      When I send a GET request to "/api/home"
      Then the API response status should be 200
      And the response body should contain "hero_title" and "stats"
      And the response should match json content type

    @TC:API-02 @regression @priority:high @type:api
    Scenario: [API-02] GET /api/news returns HTTP 200 with an array of published press communiques
      When I send a GET request to "/api/news"
      Then the API response status should be 200
      And the response body should be a non-empty array of items
      And the response should match json content type

    @TC:API-03 @regression @priority:medium @type:api
    Scenario: [API-03] GET /api/events returns HTTP 200 with structured event notifications
      When I send a GET request to "/api/events"
      Then the API response status should be 200
      And the response should match json content type

  Rule: Reports and Accounts query and filter APIs

    @TC:API-04 @smoke @priority:high @type:api
    Scenario: [API-04] GET /api/reports with pagination returns paginated records and accurate total metadata
      When I send a GET request to "/api/reports?page=2&pageSize=9"
      Then the API response status should be 200
      And the response body should contain "total" and "page"
      And the reports pagination items should not be empty

    @TC:API-05 @regression @priority:medium @type:api
    Scenario: [API-05] GET /api/reports with specific query filters returns matching report subsets
      When I send a GET request to "/api/reports?year=2024"
      Then the API response status should be 200
      And the response should match json content type

    @TC:API-06 @regression @priority:high @type:api
    Scenario: [API-06] GET /api/reports/filters returns comprehensive taxonomy dimensions
      When I send a GET request to "/api/reports/filters"
      Then the API response status should be 200
      And the response body should contain "states", "sectors", "years", and "levels"

    @TC:API-07 @regression @priority:medium @type:api
    Scenario: [API-07] GET /api/reports/{id} returns 200 for known record and 404 for non-existent record
      When I send a GET request for a valid and an invalid report ID
      Then the valid report ID should return 200 and the invalid ID should return 404

    @TC:API-08 @regression @priority:medium @type:api
    Scenario: [API-08] GET /api/accounts returns HTTP 200 with accounts portal summary payload
      When I send a GET request to "/api/accounts"
      Then the API response status should be 200
      And the response should match json content type

    @TC:API-09 @regression @priority:medium @type:api
    Scenario: [API-09] GET /api/state-accounts returns HTTP 200 with state appropriation data
      When I send a GET request to "/api/state-accounts"
      Then the API response status should be 200
      And the response should match json content type

    @TC:API-10 @regression @priority:medium @type:api
    Scenario: [API-10] GET /api/combined-accounts returns HTTP 200 with combined finance accounts data
      When I send a GET request to "/api/combined-accounts"
      Then the API response status should be 200
      And the response should match json content type

  Rule: Jurisdictions, leadership hierarchy, and versioned routing APIs

    @TC:API-12 @regression @priority:high @type:api
    Scenario: [API-12] GET /api/states returns HTTP 200 with all registered regional state subsites
      When I send a GET request to "/api/states"
      Then the API response status should be 200
      And the response body should be a non-empty array of items

    @TC:API-13 @regression @priority:high @type:api
    Scenario: [API-13] GET /api/organisation-chart returns HTTP 200 with hierarchical officer leadership
      When I send a GET request to "/api/organisation-chart"
      Then the API response status should be 200
      And the response body should contain "officers"

    @TC:API-14 @regression @priority:medium @type:api
    Scenario: [API-14] GET /api/former-cag returns HTTP 200 with former Comptroller and Auditor General records
      When I send a GET request to "/api/former-cag"
      Then the API response status should be 200
      And the response body should be a non-empty array of items

    @TC:API-16 @regression @priority:medium @type:api
    Scenario: [API-16] Comparing /api/reports and /api/v1/reports verifies identical structured responses across mount points
      When I send a GET request to both "/api/reports" and "/api/v1/reports"
      Then both endpoints should return HTTP status 200 with matching items

  Rule: Admin authentication and security token enforcement APIs

    @TC:API-17 @smoke @priority:high @type:security
    Scenario: [API-17] POST /api/admin/auth/login validates credentials and issues JWT token or rejects with 401
      When I authenticate with valid credentials via API
      Then the login API returns status 200 with an authorization token
      When I authenticate with invalid credentials via API
      Then the login API returns status 401 without a token

    @TC:API-18 @regression @priority:high @type:security
    Scenario: [API-18] Sending CRUD requests without a valid bearer token returns HTTP 401 Unauthorized
      When I send an unauthenticated request to "/api/admin/crud?table=reports"
      Then the API response status should be 401

    @TC:API-19 @regression @priority:medium @type:security
    Scenario: [API-19] Sending options requests without a valid bearer token returns HTTP 401 Unauthorized
      When I send an unauthenticated request to "/api/admin/options?type=states"
      Then the API response status should be 401
