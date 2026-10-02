import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CreditCard,
  CheckCircle,
  Clock,
  Printer,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const BillingModule = () => {
  const { bills, createInvoice, processSimulatedPayment, patients } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBillForPay, setSelectedBillForPay] = useState(null);
  const [invoiceToPrint, setInvoiceToPrint] = useState(null);

  // Create Bill Form
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [patientName, setPatientName] = useState(patients[0]?.name || '');
  const [insurancePaid, setInsurancePaid] = useState(0);
  const [items, setItems] = useState([
    { description: 'Physician Specialist Consultation', category: 'Consultation', amount: 250 }
  ]);

  // Payment Form
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState('Simulated Card Payment');

  const handleAddItem = () => {
    setItems([...items, { description: '', category: 'Consultation', amount: 100 }]);
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, val) => {
    const next = [...items];
    next[idx][field] = field === 'amount' ? Number(val) : val;
    setItems(next);
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (!patientName || items.length === 0) return;

    createInvoice({
      patientId,
      patientName,
      insurancePaid: Number(insurancePaid),
      items
    });

    setIsCreateModalOpen(false);
    setItems([{ description: 'Physician Specialist Consultation', category: 'Consultation', amount: 250 }]);
    setInsurancePaid(0);
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    if (!selectedBillForPay || payAmount <= 0) return;

    processSimulatedPayment(selectedBillForPay.id, payAmount, payMethod);
    setSelectedBillForPay(null);
  };

  const filteredBills = (bills || []).filter(b => {
    const matchesSearch =
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={22} style={{ color: 'var(--primary)' }} />
            <span>Hospital Billing, Insurance & Revenue Operations</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Itemized clinical charges (Consultation, Lab, Radiology, Ward stay, Pharmacy) and simulated payment reconciliation
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} />
          <span>+ Generate Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px' }}
            placeholder="Search invoice by ID (e.g. INV-2026-001) or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '180px', height: '40px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="Paid">Settled (Paid in Full)</option>
          <option value="Partial">Partial Settlement</option>
          <option value="Pending">Pending Payment</option>
        </select>
      </div>

      {/* Bills Table */}
      {filteredBills.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Invoices Found"
          description="There are currently no billing invoices. Generate an itemized patient bill using the button above."
          actionLabel="+ Generate First Invoice"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Patient Details</th>
                <th>Issued / Due Date</th>
                <th>Itemized Breakdown</th>
                <th>Total Billed</th>
                <th>Insurance Covered</th>
                <th>Outstanding Balance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                      {b.id}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Ref: {b.receiptReference}
                    </div>
                  </td>

                  <td>
                    <strong style={{ color: 'var(--text-main)', display: 'block' }}>{b.patientName}</strong>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{b.patientId}</span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{b.invoiceDate}</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Due: {b.dueDate}</div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {b.items?.length || 1} itemized line service(s)
                    </span>
                  </td>

                  <td>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      ${Number(b.totalAmount).toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--teal)' }}>
                      ${Number(b.insurancePaid || 0).toFixed(2)}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: b.balanceDue > 0 ? 'var(--danger)' : 'var(--success)'
                      }}
                    >
                      ${Number(b.balanceDue).toFixed(2)}
                    </span>
                  </td>

                  <td>
                    <Badge variant={b.status === 'Paid' ? 'success' : b.status === 'Partial' ? 'warning' : 'danger'}>
                      {b.status}
                    </Badge>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                        onClick={() => setInvoiceToPrint(b)}
                        title="View / Print Official Invoice"
                      >
                        <Printer size={13} />
                        Receipt
                      </button>

                      {b.balanceDue > 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px' }}
                          onClick={() => {
                            setSelectedBillForPay(b);
                            setPayAmount(b.balanceDue);
                          }}
                        >
                          <CreditCard size={13} />
                          Simulate Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="+ Generate Itemized Clinical Invoice"
        subtitle="Catalog consultation fees, diagnostic procedures, bed stay, and medications"
        maxWidth="740px"
      >
        <form onSubmit={handleSaveInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Patient</label>
              {patients.length > 0 ? (
                <select
                  className="form-select"
                  value={patientName}
                  onChange={(e) => {
                    const pat = patients.find(p => p.name === e.target.value);
                    setPatientName(e.target.value);
                    setPatientId(pat ? pat.id : '');
                  }}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Insurance Covered Amount ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={insurancePaid}
                onChange={(e) => setInsurancePaid(e.target.value)}
              />
            </div>
          </div>

          {/* Itemized Services Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Itemized Hospital Services</label>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItem}>
                + Add Service Line
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Description (e.g. Inpatient Ward Stay 3 Days)"
                    style={{ flex: 2 }}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  />

                  <select
                    className="form-select"
                    style={{ flex: 1 }}
                    value={item.category}
                    onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Room Charges">Room Charges</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="number"
                    className="form-input"
                    placeholder="Amount ($)"
                    style={{ width: '110px' }}
                    value={item.amount}
                    onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                  />

                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(idx)}
                      style={{ padding: '8px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: '12px', fontSize: '0.9rem' }}>
              <span>Total Calculated: </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                ${items.reduce((s, i) => s + Number(i.amount || 0), 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Medical Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Simulated Payment Modal */}
      <Modal
        isOpen={!!selectedBillForPay}
        onClose={() => setSelectedBillForPay(null)}
        title={`Simulate Settlement: ${selectedBillForPay?.id}`}
        subtitle={`Patient: ${selectedBillForPay?.patientName} • Balance Due: $${selectedBillForPay?.balanceDue?.toFixed(2)}`}
        maxWidth="500px"
      >
        <form onSubmit={handleSimulatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Payment Amount ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              required
              max={selectedBillForPay?.balanceDue}
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Simulated Tender Method</label>
            <select
              className="form-select"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            >
              <option value="Credit / Debit Card (Simulated)">Credit / Debit Card (Simulated)</option>
              <option value="Direct Insurance Settlement">Direct Insurance Settlement</option>
              <option value="Hospital Cashier / Bank Transfer">Hospital Cashier / Bank Transfer</option>
            </select>
          </div>

          <div style={{ padding: '12px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            ℹ️ Note: Payment gateway is running in simulated sandbox mode. No real card will be charged.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setSelectedBillForPay(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Authorize Payment of ${Number(payAmount).toFixed(2)}
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable / Downloadable Invoice Viewer */}
      <Modal
        isOpen={!!invoiceToPrint}
        onClose={() => setInvoiceToPrint(null)}
        title="Hospital Clinical Bill & Receipt"
        subtitle={`Official Statement • Reference: ${invoiceToPrint?.id}`}
        maxWidth="680px"
      >
        {invoiceToPrint && (
          <div style={{ background: '#ffffff', color: '#0f172a', padding: '24px', borderRadius: 'var(--radius-md)' }}>
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>ApexCare Hospital</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Department of Billing & Revenue Management</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>License: HOSP-REV-9910-A</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{invoiceToPrint.id}</span>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {invoiceToPrint.invoiceDate}</p>
                <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: invoiceToPrint.status === 'Paid' ? '#dcfce7' : '#fef3c7', color: invoiceToPrint.status === 'Paid' ? '#166534' : '#92400e', fontWeight: 700 }}>
                  STATUS: {invoiceToPrint.status}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Patient Name:</span>
              <strong style={{ fontSize: '1rem' }}>{invoiceToPrint.patientName}</strong>
              <span style={{ color: '#64748b', marginLeft: '8px' }}>({invoiceToPrint.patientId})</span>
            </div>

            {/* Items */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Service / Procedure</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Charge</th>
                </tr>
              </thead>
              <tbody>
                {(invoiceToPrint.items || []).map((itm, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px' }}>{itm.description}</td>
                    <td style={{ padding: '8px', color: '#64748b' }}>{itm.category}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>${Number(itm.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', fontSize: '0.875rem' }}>
              <div>Total Billed Amount: <strong>${invoiceToPrint.totalAmount?.toFixed(2)}</strong></div>
              <div>Insurance Settled: <strong style={{ color: '#0284c7' }}>-${invoiceToPrint.insurancePaid?.toFixed(2) || '0.00'}</strong></div>
              <div>Patient Paid: <strong style={{ color: '#16a34a' }}>-${invoiceToPrint.patientPaid?.toFixed(2) || '0.00'}</strong></div>
              <div style={{ fontSize: '1.05rem', borderTop: '2px solid #e2e8f0', paddingTop: '6px', marginTop: '6px' }}>
                Balance Outstanding: <strong style={{ color: invoiceToPrint.balanceDue > 0 ? '#dc2626' : '#16a34a' }}>${invoiceToPrint.balanceDue?.toFixed(2)}</strong>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
              Official Certified Hospital Healthcare Statement • Simulated Payment Receipt ID: {invoiceToPrint.receiptReference}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => window.print()}
              >
                <Printer size={14} />
                Print Statement
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
