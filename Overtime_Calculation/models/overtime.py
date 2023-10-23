from odoo import models, fields, api

class HrContract(models.Model):
    _inherit = 'hr.contract'

    worked_hour1 = fields.Float(string="Worked hour(s)", digits=(6, 2))
    worked_hour2 = fields.Float(string="Worked hour(s)", digits=(6, 2))
    worked_hour3 = fields.Float(string="Worked hour(s)", digits=(6, 2))
    worked_hour4 = fields.Float(string="Worked hour(s)", digits=(6, 2))

    total_overtime = fields.Float(string='Total Overtime', compute='_compute_total_overtime')

    @api.depends('worked_hour1', 'worked_hour2', 'worked_hour3','worked_hour4', 'wage')
    def _compute_total_overtime(self):
        for record in self:
            total_overtime1 = record.wage / 240 * (record.worked_hour1 * 1.5)
            total_overtime2 = record.wage / 240 * (record.worked_hour2 * 1.75)
            total_overtime3 = record.wage / 240 * (record.worked_hour3 * 2)
            total_overtime4 = record.wage / 240 * (record.worked_hour4 * 2.5)

            record.total_overtime = total_overtime1 + total_overtime2 + total_overtime3 + total_overtime4
            record.x_add_overtime = record.total_overtime