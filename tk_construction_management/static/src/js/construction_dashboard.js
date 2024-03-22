odoo.define('tk_construction_management.constructionDashboard', function (require) {
  'use strict';
  const AbstractAction = require('web.AbstractAction');
  const ajax = require('web.ajax');
  const core = require('web.core');
  const rpc = require('web.rpc');
  const session = require('web.session')
  const web_client = require('web.web_client');
  const _t = core._t;
  const QWeb = core.qweb;
  const ActionMenu = AbstractAction.extend({
    template: 'constructionDashboard',
    events: {
      'change #cons_site': 'view_con_site',
      'change #site_project': 'view_site_project',
      'click .total-site': 'view_total_site',
      'click .total-project': 'view_total_project',
      'click .total-mrq': 'view_total_mrq',
      'click .job-sheet': 'view_total_job_sheet',
      'click .job-order': 'view_total_job_order',
      'click .project-planning': 'view_project_planning',
      'click .project-procurement': 'view_project_procurement',
      'click .project-construction': 'view_project_construction',
      'click .project-handover': 'view_project_handover',
      'click .mr-draft': 'view_mr_draft',
      'click .mr-waiting-approval': 'view_mr_waiting_approval',
      'click .mr-approved': 'view_mr_approved',
      'click .mr-ready-delivery': 'view_mr_ready_delivery',
      'click .mr-material-arrive': 'view_mr_material_arrive',
      'click .mr-material-internal-transfer': 'view_mr_material_internal_transfer',
      'click .mr-back-order': 'view_mr_back_order',
      'click .it-draft': 'view_it_draft',
      'click .it-in-progress': 'view_it_in_progress',
      'click .it-done': 'view_it_done',
      'click .it-forward-transfer': 'view_it_forward_transfer',
      'click .equip-po': 'view_equip_po',
      'click .labour-po': 'view_labour_po',
      'click .overhead-po': 'view_overhead_po',
      'click .mr-po': 'view_mr_po',
    },
    renderElement: function (ev) {
      const self = this;
      $.when(this._super())
        .then(function (ev) {
          rpc.query({
            model: "tk.construction.dashboard",
            method: "get_construction_state",
            args: [false, false],
          }).then(function (result) {
            let site_options = ''
            for (let rec in result['con_sites']) {
              site_options += "<option value='" + rec + "'>" + result['con_sites'][rec] + "</option>"
            }
            let site_ui = "<option value='all_site'>All Projects</option>" + site_options
            $('#cons_site').empty().append(site_ui);
            self.set_stats(result);
          });
        });
    },
    set_stats: function (result) {
      const self = this;
      $('#total_site').empty().append(result['total_site']);
      $('#total_project').empty().append(result['total_project']);
      $('#total_mrq').empty().append(result['total_mrq']);
      $('#job_sheet_count').empty().append(result['job_sheet_count']);
      $('#job_order_count').empty().append(result['job_order_count']);
      $('#project_planning').empty().append(result['project_status'][1][0]);
      $('#project_procurement').empty().append(result['project_status'][1][1]);
      $('#project_construction').empty().append(result['project_status'][1][2]);
      $('#project_handover').empty().append(result['project_status'][1][3]);
      $('#mr_draft').empty().append(result['mrq_state'][1][0]);
      $('#mr_waiting_approval').empty().append(result['mrq_state'][1][1]);
      $('#mr_approved').empty().append(result['mrq_state'][1][2]);
      $('#mr_ready_delivery').empty().append(result['mrq_state'][1][3]);
      $('#mr_material_arrive').empty().append(result['mrq_state'][1][4]);
      $('#mr_internal_transfer').empty().append(result['mrq_state'][1][5]);
      $('#back_order').empty().append(result['back_order']);
      $('#it_draft').empty().append(result['internal_state'][1][0]);
      $('#it_in_progress').empty().append(result['internal_state'][1][1]);
      $('#it_done').empty().append(result['internal_state'][1][2]);
      $('#forward_transfer').empty().append(result['forward_transfer']);
      $('#mr_po').empty().append(result['purchase_order']['mr_po']);
      $('#equip_po').empty().append(result['purchase_order']['equip_po']);
      $('#labour_po').empty().append(result['purchase_order']['labour_po']);
      $('#overhead_po').empty().append(result['purchase_order']['overhead_po']);
      self.siteState(result['site_state']);
      self.materialRequisition(result['mrq_state']);
      self.internalTransfer(result['internal_state']);
      self.getSiteTimeline(result['site_timeline']);
      self.getProjectTimeline(result['project_timeline']);
      self.getProjectStatus(result['project_status']);
      self.getJobOrderPo(result['job_order_po']);
    },
    view_con_site: function (ev) {
      ev.preventDefault();
      const siteFilter = $('#cons_site option:selected').val();
      const self = this;
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_project_list",
        args: [siteFilter],
      }).then(function (data) {
        if (data !== undefined) {
          let project_options = ''
          for (let rec in data) {
            project_options += "<option value='" + rec + "'>" + data[rec] + "</option>"
          }
          let project_ui = "<option value='all_project'>All Sub Projects</option>" + project_options
          $('#site_project').empty().append(project_ui);
          self.view_site_state()
        }
      });
    },
    view_site_project: function (ev) {
      ev.preventDefault();
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      const self = this;
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_state",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined) {
          self.set_stats(data);
        }
      });
    },
    view_site_state: function () {
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      const self = this;
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_state",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined) {
          self.set_stats(data);
        }
      });
    },
    view_total_site: function (ev) {
      ev.preventDefault();
      return this.do_action({
        name: _t('Project'),
        type: 'ir.actions.act_window',
        res_model: 'tk.construction.site',
        views: [[false, 'list'], [false, 'form']],
        target: 'current'
      });
    },
    view_total_project: function (ev) {
      ev.preventDefault();
      const self = this;
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          return self.do_action({
            name: _t('Projects'),
            type: 'ir.actions.act_window',
            res_model: 'tk.construction.project',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_total_mrq: function (ev) {
      ev.preventDefault();
      const self = this;
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          return self.do_action({
            name: _t('Material Requisition'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_total_job_sheet: function (ev) {
      ev.preventDefault();
      const self = this;
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          return self.do_action({
            name: _t('Job Costing'),
            type: 'ir.actions.act_window',
            res_model: 'job.costing',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_total_job_order: function (ev) {
      ev.preventDefault();
      const self = this;
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          return self.do_action({
            name: _t('Work Order'),
            type: 'ir.actions.act_window',
            res_model: 'job.order',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_project_planning: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'Planning'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('Project Planning'),
            type: 'ir.actions.act_window',
            res_model: 'tk.construction.project',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_project_procurement: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'Procurement'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('Project Procurement'),
            type: 'ir.actions.act_window',
            res_model: 'tk.construction.project',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_project_construction: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'Construction'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('Project Construction'),
            type: 'ir.actions.act_window',
            res_model: 'tk.construction.project',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_project_handover: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'Handover'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('Project Handover'),
            type: 'ir.actions.act_window',
            res_model: 'tk.construction.project',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_draft: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'draft'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('Draft'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_waiting_approval: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'department_approval'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('Department Approval'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_approved: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'approve'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('In Progress'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_ready_delivery: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'ready_delivery'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('Ready Delivery'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_material_arrive: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'material_arrived'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('Material Arrived'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_material_internal_transfer: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'internal_transfer'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('Internal Transfer'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_back_order: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['is_back_order', '=', true];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('Back Order'),
            type: 'ir.actions.act_window',
            res_model: 'material.requisition',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_it_draft: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'draft'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('Draft'),
            type: 'ir.actions.act_window',
            res_model: 'internal.transfer',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_it_in_progress: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'in_progress'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('In Progress'),
            type: 'ir.actions.act_window',
            res_model: 'internal.transfer',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_it_done: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['stage', '=', 'done'];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('Done'),
            type: 'ir.actions.act_window',
            res_model: 'internal.transfer',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_it_forward_transfer: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['is_forward_transfer', '=', true];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[0].push(domain)
          return self.do_action({
            name: _t('Forward Transfer'),
            type: 'ir.actions.act_window',
            res_model: 'internal.transfer',
            domain: data[0],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_mr_po: function (ev) {
      ev.preventDefault();
      const self = this;
      let domain = ['material_req_id', '!=', false];
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_construction_project_domain",
        args: [siteFilter, projectFilter],
      }).then(function (data) {
        if (data !== undefined && data.length == 2) {
          data[1].push(domain)
          return self.do_action({
            name: _t('MREQ Purchase Order'),
            type: 'ir.actions.act_window',
            res_model: 'purchase.order',
            domain: data[1],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_equip_po: function (ev) {
      ev.preventDefault();
      const self = this;
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_job_order_po",
        args: [siteFilter, projectFilter, 'equip'],
      }).then(function (data) {
        if (data !== undefined) {
          return self.do_action({
            name: _t('Equipment Purchase Order'),
            type: 'ir.actions.act_window',
            res_model: 'purchase.order',
            domain: [['id', 'in', data]],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_labour_po: function (ev) {
      ev.preventDefault();
      const self = this;
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_job_order_po",
        args: [siteFilter, projectFilter, 'labour'],
      }).then(function (data) {
        if (data !== undefined) {
          return self.do_action({
            name: _t('Labour Purchase Order'),
            type: 'ir.actions.act_window',
            res_model: 'purchase.order',
            domain: [['id', 'in', data]],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    view_overhead_po: function (ev) {
      ev.preventDefault();
      const self = this;
      const siteFilter = $('#cons_site option:selected').val();
      const projectFilter = $('#site_project option:selected').val();
      rpc.query({
        model: "tk.construction.dashboard",
        method: "get_job_order_po",
        args: [siteFilter, projectFilter, 'overhead'],
      }).then(function (data) {
        if (data !== undefined) {
          return self.do_action({
            name: _t('Overhead Purchase Order'),
            type: 'ir.actions.act_window',
            res_model: 'purchase.order',
            domain: [['id', 'in', data]],
            views: [[false, 'list'], [false, 'form']],
            target: 'current'
          });
        }
      });
    },
    get_action: function (ev, name, res_model) {
      ev.preventDefault();
      return this.do_action({
        name: _t(name),
        type: 'ir.actions.act_window',
        res_model: res_model,
        views: [[false, 'kanban'], [false, 'tree'], [false, 'form']],
        target: 'current'
      });
    },
    apexGraph: function () {
      Apex.grid = {
        padding: {
          right: 0,
          left: 0,
          top: 10,
        }
      }
      Apex.dataLabels = {
        enabled: false
      }
    },
    siteState: function (data) {
      const options = {
        series: data[1],
        chart: {
          type: 'donut',
          height: 410
        },
        colors: ['#95e2f9', '#f9aa4f', '#62dfc7'],
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'gradient',
        },
        labels: data[0],
        legend: {
          position: 'bottom',
        },
      };
      this.renderGraph("#site_state", options);
    },
    materialRequisition: function (data) {
      const options = {
        series: data[1],
        chart: {
          type: 'pie',
          height: 410
        },
        colors: ['#95e2f9', '#f9aa4f', '#efe7ac', '#9daacf', '#62dfc7', '#ff5765'],
        dataLabels: {
          enabled: false
        },
        labels: data[0],
        legend: {
          position: 'bottom',
        },
      };
      this.renderGraph("#mrq_state", options);
    },
    internalTransfer: function (data) {
      const options = {
        series: data[1],
        chart: {
          type: 'donut',
          height: 410
        },
        colors: ['#95e2f9', '#f9aa4f', '#62dfc7'],
        dataLabels: {
          enabled: false
        },
        labels: data[0],
        legend: {
          position: 'bottom',
        },
      };
      this.renderGraph("#internal_transfer_state", options);
    },
    getSiteTimeline: function (data) {
      let site_data = []
      for (const ss of data) {
        site_data.push({
          'name': ss['name'],
          'data': [{
            'x': 'Timeline',
            'y': [new Date(ss['start_date']).getTime(), new Date(ss['end_date']).getTime()]
          }]
        })
      }
      const options = {
        series: site_data,
        chart: {
          height: 350,
          type: 'rangeBar'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            var a = moment(val[0])
            var b = moment(val[1])
            var diff = b.diff(a, 'days')
            return diff + (diff > 1 ? ' days' : ' day')
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },
        xaxis: {
          type: 'datetime'
        }
      };
      this.renderGraph("#construction_time_line", options);
    },
    getProjectTimeline: function (data) {
      let project_data = []
      for (const ss of data) {
        project_data.push({
          'name': ss['name'],
          'data': [{
            'x': "Project",
            'y': [new Date(ss['start_date']).getTime(), new Date(ss['end_date']).getTime()]
          }]
        })
      }
      const options = {
        series: project_data,
        chart: {
          height: 350,
          type: 'rangeBar'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            var a = moment(val[0])
            var b = moment(val[1])
            var diff = b.diff(a, 'days')
            return diff + (diff > 1 ? ' days' : ' day')
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },
        xaxis: {
          type: 'datetime'
        }
      };
      this.renderGraph("#project_time_line", options);
    },
    getProjectStatus: function (data) {
      const options = {
        series: data[1],
        chart: {
          type: 'donut',
          height: 410
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'gradient',
        },
        labels: data[0],
        legend: {
          position: 'bottom',
        },
      };
      this.renderGraph("#project_status", options);
    },
    getJobOrderPo: function (data) {
      const options = {
        series: [
          {
            name: "Material Purchase Order",
            data: data[1]
          },
          {
            name: "Equipment Purchase Order",
            data: data[2]
          },
          {
            name: "Labour Purchase Order",
            data: data[3]
          },
          {
            name: "Overhead Purchase Order",
            data: data[4]
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: true
          },
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          tooltipHoverFormatter: function (val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: data[0],
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val) {
                  return val + " Count"
                }
              }
            },
            {
              title: {
                formatter: function (val) {
                  return val + " Count"
                }
              }
            }, {
              title: {
                formatter: function (val) {
                  return val + " Count"
                }
              }
            }, {
              title: {
                formatter: function (val) {
                  return val + " Count"
                }
              }
            },
            {
              title: {
                formatter: function (val) {
                  return val;
                }
              }
            }
          ]
        },
        grid: {
          borderColor: '#f1f1f1',
        }
      };
      this.renderGraph("#job_order_po", options);
    },
    renderGraph: function (render_id, options) {
      $(render_id).empty();
      const graphData = new ApexCharts(document.querySelector(render_id), options);
      graphData.render();
    },
    willStart: function () {
      const self = this;
      self.drpdn_show = false;
      return Promise.all([ajax.loadLibs(this), this._super()]);
    },
  });
  core.action_registry.add('construction_dashboard', ActionMenu);
});
