import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  Calendar,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const PatientBillingView = ({ onNavigate }) => {
  const { activePatientId } = useAuth();
  const { patients, bills, processSimulatedPayment } = useHospitalData();
  const [payingBillId, setPayingBillId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0] || {
    id: activePatientId || 'PAT-1001',
    name: 'Patient'
  };

  const myBills = (bills || []).filter(
    b => b.patientId === currentPatient.id || b.patientName?.toLowerCase() === currentPatient.name?.toLowerCase()
  );

  const totalDue = myBills
    .filter(b => b.status !== 'Paid')
    .reduce((sum, b) => sum + Number(b.balanceDue || 0), 0);

  const handlePay = (billId, amount) => {
    setPayingBillId(billId);
    setTimeout(() => {
      processSimulatedPayment(billId, amount, 'Credit Card');
      setPayingBillId(null);
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 3000);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={22} style={{ color: 'var(--primary)' }} />
            <span>My Hospital Invoices & Statements</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Transparent itemized clinical fees, insurance coverage copays, and digital payment records
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-dim)' }}>Outstanding Balance:</span>
          <Badge variant={totalDue > 0 ? 'danger' : 'success'}>
            ${totalDue.toFixed(2)}
          </Badge>
        </div>
      </div>

      {paymentSuccess && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} />
          <span>Payment successfully recorded! Your hospital statement has been updated.</span>
        </div>
      )}

      {myBills.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Invoices on File"
          description="You currently have no outstanding or past hospital billing statements."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myBills.map(bill => (
            <div
              key={bill.id}
              className="card"
              style={{
                border: '1px solid var(--border-subtle)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                    {bill.id}
                  </span>
                  <Badge variant={bill.status === 'Paid' ? 'success' : bill.status === 'Partial' ? 'warning' : 'danger'}>
                    {bill.status}
                  </Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    Date: {bill.date}
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ${Number(bill.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              {bill.items && bill.items.length > 0 && (
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Itemized Services:</span>
                  <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-muted)' }}>
                    {bill.items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>
                        {item.description} — <strong style={{ color: 'var(--text-main)' }}>${Number(item.amount || 0).toFixed(2)}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Balance & Payment */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Balance Due: </span>
                  <strong style={{ color: bill.balanceDue > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    ${Number(bill.balanceDue || 0).toFixed(2)}
                  </strong>
                  {bill.paidAmount > 0 && (
                    <span style={{ color: 'var(--text-dim)', marginLeft: '8px' }}>
                      (Paid: ${Number(bill.paidAmount).toFixed(2)})
                    </span>
                  )}
                </div>

                {bill.balanceDue > 0 && (
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={payingBillId === bill.id}
                    onClick={() => handlePay(bill.id, bill.balanceDue)}
                  >
                    <CreditCard size={14} />
                    <span>{payingBillId === bill.id ? 'Processing...' : `Pay Online ($${Number(bill.balanceDue).toFixed(2)})`}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
