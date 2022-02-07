INSERT INTO department (dept_name) VALUES
    ('marketing'),
    ('production'),
    ('executive');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('marketing-junior', '35000.00', '1'),
    ('marketing-lead', '50000.00', '1'),
    ('marketing-manager', '70000.00', '1'),
    ('production-junior', '35000.00', '2'),
    ('production-lead', '50000.00','2'),
    ('production-manager', '70000.00', '2'),
    ('executive-manager', '90000.00', '3');

INSERT INTO employee (first_name, last_name, role_id, is_manager, manager_id)
VALUES
    ('Leoni', 'Walmsley', '1', false, '1'),
    ('Emmett', 'Kidd', '1', false, '1'),
    ('Abi', 'Parry', '2', false, '1'),
    ('Heath', 'Robles', '3', true, '3'),
    ('Lenny', 'Orr', '4', false, '2'),
    ('James', 'Donovan', '4', false, '2'),
    ('Cavan', 'Craft', '5', false, '2'),
    ('Anabelle', 'Case', '6', true, '3'),
    ('Gabriella', 'Bradford', '7', true, NULL),
    ('Stephen', 'Leach', '7', true, NULL);