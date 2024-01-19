from odoo import fields, models, api
from odoo.exceptions import UserError


class VehicleTransfer(models.Model):
    _name = "vehicle.transfer"
    _description = "Vehicle Transfer"
    _inherit = ['mail.thread', 'mail.activity.mixin']
    name = fields.Char(compute="_compute_vehicle_transfer_name", store=True)

    # Fields in header
    ## Fields defined and related fields
    reference = fields.Char(string='Reference', readonly=True, default='Draft', store=True)
    return_reference = fields.Char(string='Return Reference', readonly=True, )
    transfer_type = fields.Selection([('delivery', 'Delivery'), ('return', 'Return')], string="Transfer Type",
                                     default='delivery', track_visibility='always', store=True)
    vehicle_id = fields.Many2one('fleet.vehicle', 'Vehicle', required=True, track_visibility='always',
                                 )
    driver_name = fields.Char(string='Driver', readonly=True, track_visibility='always', )
    license_plate = fields.Char(string='Licence Plate', readonly=True,
                                track_visibility='always', )
    chassis_number = fields.Char(string='Chassis Number', readonly=True,
                                 track_visibility='always', )
    motor_number = fields.Char(string="Motor Number", help="Vehicle Motor Number", readonly=True,
                               track_visibility='always',
                               )
    last_odometer = fields.Float(string="Last Odometer",
                                 track_visibility='always', store=True)
    odometer_unit = fields.Char(string='Odometer Unit', readonly=True,
                                )
    model_brand = fields.Char(string='Model', readonly=True, track_visibility='always',
                              )
    model_year = fields.Char(string='Model Year', readonly=True,
                             track_visibility='always', )
    date = fields.Date(string="Date", track_visibility='always', store=True)
    date_range = fields.Integer(string="Date Range", readonly=True, compute='_compute_date_range', store=True)
    image_128 = fields.Image()
    company_id = fields.Many2one('res.company', 'Company', default=lambda self: self.env.company, readonly=True,
                                 store=True)

    ## Fields defined specifically for return
    vehicle_delivery_id = fields.Many2one('vehicle.transfer', 'Return of Delivery',
                                          track_visibility='always', onchange="_onchange_vehicle_related", store=True)

    @api.onchange('vehicle_id', 'vehicle_delivery_id')
    def _onchange_vehicle_related(self):
        for rec in self:
            if rec.transfer_type == 'delivery':
                rec.license_plate = rec.vehicle_id.license_plate
                rec.driver_name = rec.vehicle_id.driver_id.name
                rec.chassis_number = rec.vehicle_id.vin_sn
                # rec.last_odometer = rec.vehicle_id.odometer
                rec.odometer_unit = rec.vehicle_id.odometer_unit
                rec.model_brand = (rec.vehicle_id.model_id.brand_id.name or '') + '/' + (
                        rec.vehicle_id.model_id.name or '')
                rec.model_year = rec.vehicle_id.model_year
                rec.motor_number = rec.vehicle_id.motor_number

            elif rec.transfer_type == 'return':
                rec.return_reference = rec.vehicle_delivery_id.reference
                rec.vehicle_id = rec.vehicle_delivery_id.vehicle_id
                rec.license_plate = rec.vehicle_delivery_id.license_plate
                rec.driver_name = rec.vehicle_delivery_id.driver_name
                rec.chassis_number = rec.vehicle_delivery_id.chassis_number
                rec.last_odometer = rec.vehicle_delivery_id.last_odometer
                rec.odometer_unit = rec.vehicle_delivery_id.odometer_unit
                rec.model_brand = rec.vehicle_delivery_id.model_brand
                rec.model_year = rec.vehicle_delivery_id.model_year
                rec.motor_number = rec.vehicle_delivery_id.motor_number

    # override create method to add reference
    @api.model
    def create(self, vals):
        if vals.get('transfer_type') == 'delivery':
            if vals.get('reference', 'Draft') == 'Draft':
                vals['reference'] = self.env['ir.sequence'].next_by_code('vehicle.transfer.sequence') or 'Draft'
        elif vals.get('transfer_type') == 'return':
            vals['reference'] = vals.get('return_reference')
        return super(VehicleTransfer, self).create(vals)

    # Fields defined for checkboxes and notes

    fields_defined = [
        ("front_l_s_parking_light", "Front L.S Parking Light", "Front Left Side Parking Light"),
        ("front_r_s_parking_light", "Front R.S Parking Light", "Front Right Side Parking Light"),
        ("front_l_h_light", "Front L.H Light", "Front Left Head Light"),
        ("front_r_h_light", "Front R.H Light", "Front Right Head Light"),
        ("front_l_beam_light", "Front Left Beam Light", "Front Left Beam Light"),
        ("front_r_beam_light", "Front Right Beam Light", "Front Right Beam Light"),
        ("front_l_signal_light", "Front Left Signal Light", "Front Left Signal Light"),
        ("front_r_signal_light", "Front Right Signal Light", "Front Right Signal Light"),
        ("front_rl_side_big_light", "Front Right & Left Side Big Light", "Front Right & Left Side Big Light"),
        ("front_bumper", "Front Bumper", "Front Bumper"),
        ("radiator_cap", "Radiator Cap", "Radiator Cap"),
        ("motor_oil_cap", "Motor Oil Cap", "Motor Oil Cap"),
        ("motor_oil_label_check_up", "Motor Oil Label Check Up", "Motor Oil Label Check Up"),
        ("brake_oil_cap", "Brake Oil Cap", "Brake Oil Cap"),
        ("clutch_oil_cap", "Clutch Oil Cap", "Clutch Oil Cap"),
        ("spare_wheel", "Spare Wheel", "Spare Wheel"),
        ("sun_in_side_visor", "Sun in Side Visor", "Sun in Side Visor"),
        ("door_glass_handle", "Door Glass Handle", "Door Glass Handle"),
        ("door_outer_opening_handle", "Door Outer Opening Handle", "Door Outer Opening Handle"),
        ("jack_with_accessories", "Jack with Accessories", "Jack with Accessories"),
        ("plate_no_light", "Plate No. Light", "Plate No. Light"),
        ("rear_bumper", "Rear Bumper", "Rear Bumper"),
        ("fuel_tanker_cap", "Fuel Tanker Cap", "Fuel Tanker Cap"),
        ("wheel_cover_front", "Wheel Cover Front", "Wheel Cover Front"),
        ("wheel_cover_rear", "Wheel Cover Rear", "Wheel Cover Rear"),

        # second column
        ("horn", "Horn", "Horn"),
        ("wheel_oil_cap", "Wheel Oil Cap", "Wheel Oil Cap"),
        ("battery_type", "Battery Type", "Battery Type"),
        ("mirror_view_ls", "Mirror View L.S.", "Mirror View L.S."),
        ("mirror_view_rs", "Mirror View R.S.", "Mirror View R.S."),
        ("mirror_view_inside", "Mirror View In Side", "Mirror View In Side"),
        ("wiper_front_side", "Wiper Front Side", "Wiper Front Side"),
        ("wiper_back_side", "Wiper Back Side", "Wiper Back Side"),
        ("seat_cover", "Seat Cover", "Seat Cover"),
        ("floor_inside_mat", "Floor inside Mat", "Floor inside Mat"),
        ("mud_guard_front_ls_mat", "Mud Guard Front LS Mat", "Mud Guard Front LS Mat"),
        ("mud_guard_front_rs_mat", "Mud Guard Front RS Mat", "Mud Guard Front RS Mat"),
        ("mud_guard_rear_ls_mat", "Mud Guard Rear LS Mat", "Mud Guard Rear LS Mat"),
        ("mud_guard_rear_rs_mat", "Mud Guard Rear RS Mat", "Mud Guard Rear RS Mat"),
        ("tape_type", "Tape Type", "Tape Type"),
        ("cigarette_lighter", "Cigarette Lighter", "Cigarette Lighter"),
        ("fire_extinguisher", "Fire Extinguisher", "Fire Extinguisher"),
        ("vehicle_inside_light", "Vehicle inside Light", "Vehicle inside Light"),
        ("front_side_glass", "Front Side Glass", "Front Side Glass"),
        ("rear_driver_back_side_glass", "Rear Driver Back Side Glass", "Rear Driver Back Side Glass"),
        ("rear_ls_parking_light", "Rear LS Parking Light", "Rear LS Parking Light"),
        ("rear_rs_parking_light", "Rear RS Parking Light", "Rear RS Parking Light"),
        ("rear_ls_brake_light", "Rear LS Brake Light", "Rear LS Brake Light"),
        ("rear_rs_brake_light", "Rear RS Brake Light", "Rear RS Brake Light"),
        ("rear_left_signal_light", "Rear Left Signal Light", "Rear Left Signal Light"),
        ("rear_right_signal_light", "Rear Right Signal Light", "Rear Right Signal Light"),
    ]
    # create fields based on the above list
    for field_name, field_string, field_help in fields_defined:
        locals()[field_name] = fields.Selection([('available', 'Available'), ('not_available', 'Not Available')],
                                                string=field_string, default=False,
                                                help=field_help,
                                                track_visibility='always')
        locals()[field_name + "_note"] = fields.Text(default=False, track_visibility='always',
                                                     string=field_string + ' Note')

    # additional fields only text box
    motor_condition = fields.Text(default=False, string='Motor Condition', track_visibility='always', )
    vehicle_outer_body_condition = fields.Text(default=False, string='Vehicle Outer Body Condition',
                                               track_visibility='always', )
    terms_conditions = fields.Text(default=False, string='Terms and Conditions', track_visibility='always', )

    # transfer states
    state = fields.Selection([
        ('draft', 'Draft'),
        ('confirm', 'Confirmed'),
        ('approve', 'Approved'),
        ('close', 'Closed'),
        ('cancel', 'Cancelled'),
    ], string='State', default='draft', copy=False, track_visibility='always')

    def action_draft(self):
        self.state = 'draft'

    def action_confirm(self):
        self.state = 'confirm'

    def action_approve(self):
        self.state = 'approve'
        for rec in self:
            if rec.transfer_type == 'return' and rec.vehicle_delivery_id.state == 'approve':
                self.state = 'close'
                rec.vehicle_delivery_id.state = 'close'

            elif rec.transfer_type == 'return':
                raise UserError('You can not close a delivery record that is not approved!')

    def action_cancel(self):
        self.state = 'cancel'

    # a name field for the title of the record
    @api.depends('reference', 'model_brand')
    def _compute_vehicle_transfer_name(self):
        for rec in self:
            rec.name = (rec.reference or '') + '(' + (rec.model_brand or '') + ')'

    @api.depends('date')
    def _compute_date_range(self):
        for rec in self:
            if rec.transfer_type == 'return':
                if rec.vehicle_delivery_id.date and rec.date:
                    delta = rec.date - rec.vehicle_delivery_id.date
                    rec.date_range = delta.days
                else:
                    rec.date_range = 0
