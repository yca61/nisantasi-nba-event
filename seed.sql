-- Synthetic test records only. These are not real applicants or contact details.
INSERT OR IGNORE INTO applications (
    id, application_type, first_name, last_name, email, phone,
    institution, department, team_name, consent, status
) VALUES
    (1, 'competitor', 'Test', 'Oyuncu', 'player1@example.test', '+905550000001',
     'Örnek Üniversite', 'Spor Bilimleri', 'Test Takımı A', 1, 'pending'),
    (2, 'tribune', 'Test', 'Izleyici', 'guest1@example.test', '+905550000002',
     'Örnek Üniversite', NULL, NULL, 1, 'approved'),
    (3, 'competitor', 'Deneme', 'Kullanıcı', 'player2@example.test', '+905550000003',
     'Deneme Koleji', NULL, 'Test Takımı B', 1, 'pending');
