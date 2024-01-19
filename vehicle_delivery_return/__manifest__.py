{
    "name": "Vehicle Delivery & Return",
    "summary": "Extends fleet application for the purpose of a vehicle delivery and return for staffs",
    "version": "15.0.0.0.1",
    "author": "Natnael Abebaw",
    "license": "AGPL-3",
    "category": "Human Resources/Vehicle Delivery & Return",
    "images": [],
    "depends": ['fleet'],
    "data": [
        'security/vehicle_transfer_security.xml',
        'security/ir.model.access.csv',
        'views/vehicle_transfer_view.xml',
        'views/fleet_vehicle_inherit_view.xml',
        'data/vehicle_transfer_sequence.xml',
    ],
    # "external_dependencies": {"python": ["dateutil"]},
    "installable": True,
}
