from odoo import models, fields


class payroll_batches_approval(models.Model):
    _inherit = 'hr.payslip.run'

    approved_by = fields.Many2one('res.users', 'Approved By')

    state = fields.Selection(
        selection_add=[('approve', 'Approved'), ('paid',)],
    )

    def action_approve(self):
        for rec in self:
            rec.approved_by = self.env.user
        self.write({'state': 'approve'})
