from odoo import models, fields


class FleetVehicleInherit(models.Model):
    _inherit = 'fleet.vehicle'

    motor_number = fields.Char(string="Motor Number", track_visibility=True)
