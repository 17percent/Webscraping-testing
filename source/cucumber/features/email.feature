Feature: Outlook automation

  Scenario: Log in and send an email on Outlook
    Given I navigate to "https://outlook.com/"
    When I click the login button
    And I log in with email "Mateszonline2002@gmail.com" and password "Matesz20020215"
    Then I decline to stay logged in
    And I click the New message button
    And I send an email to "Mateszonline2002@gmail.com" with subject "random"
    And I navigate to sent mails
    And I delete the sent email
    Then I close the browser