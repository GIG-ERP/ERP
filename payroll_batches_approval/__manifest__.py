# -*- coding: utf-8 -*-
{
    'name': "Payroll Batches Approval",
    'summary': """This module adds a functionality to approve batches in payroll before paid.""",
    'description': """""",
    'author': "Natnael Abebaw",
    'website': "https://www.linkedin.com/in/natnael-abebaw/",
    'category': 'Human Resources/Payroll Batches Approval',
    'version': '0.1',
    'license': 'AGPL-3',
    'depends': ['hr_payroll'],
    'data': [
        'security/payroll_batches_approval_security.xml',
        'views/payroll_batches_approval_view.xml',
    ],
}
