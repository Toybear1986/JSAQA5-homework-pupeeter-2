Feature: Booking ticket on weekend
    Scenario: Choice day, film and time and check buying info
        Given user is on page "http://qamid.tmweb.ru/client/index.php"
        When user make booking for weekend, and choose "Фильм 3" в "Зал 2" в "15:00"
        Then user sees proper information "Фильм 3" в "Зал 2" в "15:00" for her booking