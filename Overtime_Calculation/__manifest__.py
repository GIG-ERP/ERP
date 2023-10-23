{
    'name': 'Overtime Calculation',
    'author': 'Natnael Abebaw',
    'description': 'This sub module calulates ovetime addition in payroll module',
    'summary': """
                Overtime pay is calculated using the following formula:
                Overtime Pay = Salary / Hourly Salary * (Hours Worked * Factor(1.5, 1.75, 2, 2.5))
                For example, if an employee's monthly salary is 30,000 and they worked 20 hours on a holiday, the overtime pay would be calculated as follows:
                (30,000 / 30 / 8) * (2.5 (holiday) * 20 (worked hours)) = 6,250
                """,
    'version': '1',
    'category': 'Payroll',
    'depends': ['hr_payroll'],
    'data': [
        'views/overtime.xml',
    ],
    'installable': True,
    # 'icon': '',
    'application': False,
    'auto_install': False,
    'sequence': '0'
}