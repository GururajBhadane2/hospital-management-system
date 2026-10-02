import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
  Edit,
  DollarSign
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const PharmacyModule = () => {
  const { medicines, addMedicine, updateMedicineStock, pharmacyOrders, updatePharmacyOrderStatus } = useHospitalData();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    genericName: '',
    category: 'Cardiovascular',
    dosageForm: 'Tablet 500mg',
    stockQuantity: 100,
    minStockLevel: 25,
    unitPrice: 1.50,
    manufacturer: 'PharmaCorp Labs',
    batchNumber: `BN-${Date.now().toString().slice(-4)}`,
    expiryDate: '2028-12-31'
  });

  const handleSaveMedicine = (e) => {
    e.preventDefault();
    if (!form.name) return;
    addMedicine(form);
    setIsAddModalOpen(false);
  };

  const filteredMedicines = (medicines || []).filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = (pharmacyOrders || []).filter(o =>
    o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={22} style={{ color: 'var(--info)' }} />
            <span>Hospital Pharmacy Formulary & Dispensing</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Track drug formulary stock, safety thresholds, batch expirations, and clinical prescription orders
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            + Add Medicine
          </button>
        </div>
      </div>

      {/* Tabs for Inventory vs Orders */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <button
          className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('inventory')}
        >
          Formulary Inventory ({medicines.length})
        </button>
        <button
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('orders')}
        >
          Prescription Orders ({pharmacyOrders.length})
        </button>
      </div>

      {/* Search Bar */}
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
            placeholder={activeTab === 'inventory' ? "Search medicine by name, generic formulation, or therapeutic class..." : "Search pharmacy order by patient name or order ID..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        filteredMedicines.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="Formulary is Empty"
            description="No pharmaceutical medicines entered yet. Add medicines with stock counts and unit prices."
            actionLabel="+ Add Medicine"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Drug Code / Name</th>
                  <th>Generic Formulation</th>
                  <th>Category</th>
                  <th>Dosage Form</th>
                  <th>Stock Quantity</th>
                  <th>Unit Price</th>
                  <th>Batch / Expiry</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Update Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((med) => (
                  <tr key={med.id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{med.name}</strong>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {med.id}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{med.genericName}</span>
                    </td>

                    <td>
                      <Badge variant="primary">{med.category}</Badge>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{med.dosageForm}</span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: med.stockQuantity <= med.minStockLevel ? 'var(--danger)' : 'var(--text-main)' }}>
                          {med.stockQuantity}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          (Min: {med.minStockLevel})
                        </span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        ${Number(med.unitPrice).toFixed(2)}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{med.batchNumber || 'BN-2026'}</div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Exp: {med.expiryDate}</span>
                    </td>

                    <td>
                      <Badge variant={med.stockQuantity === 0 ? 'danger' : med.stockQuantity <= med.minStockLevel ? 'warning' : 'success'}>
                        {med.status || (med.stockQuantity > med.minStockLevel ? 'In Stock' : 'Low Stock')}
                      </Badge>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => updateMedicineStock(med.id, Math.max(0, med.stockQuantity - 10))}
                          title="-10 Stock"
                        >
                          -10
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => updateMedicineStock(med.id, med.stockQuantity + 50)}
                          title="+50 Stock Restock"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        filteredOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Pharmacy Orders"
            description="Prescriptions issued by doctors or ordered by patients will appear here for fulfillment."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Patient Details</th>
                  <th>Order Date</th>
                  <th>Items Summary</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Process Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                        {ord.id}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{ord.patientName}</strong>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{ord.patientId}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ord.orderDate}</span>
                    </td>

                    <td style={{ maxWidth: '280px' }}>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>{ord.itemsSummary}</span>
                      {ord.pharmacistNotes && (
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '2px' }}>
                          Note: {ord.pharmacistNotes}
                        </div>
                      )}
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${ord.totalAmount?.toFixed(2)}</span>
                    </td>

                    <td>
                      <Badge variant={ord.status === 'Completed' || ord.status === 'Dispatched' ? 'success' : ord.status === 'Ready' ? 'info' : 'warning'}>
                        {ord.status}
                      </Badge>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem', height: '30px' }}
                        value={ord.status}
                        onChange={(e) => updatePharmacyOrderStatus(ord.id, e.target.value)}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready for Pickup</option>
                        <option value="Dispatched">Dispatched to Ward</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Add Medicine Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="+ Catalog New Medicine in Hospital Formulary"
        subtitle="Specify therapeutic dosage, initial batch stock, and threshold alerts"
        maxWidth="680px"
      >
        <form onSubmit={handleSaveMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Commercial Brand Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Amlodipine Besylate"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Generic Formulation</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Amlodipine"
                value={form.genericName}
                onChange={(e) => setForm({ ...form, genericName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Therapeutic Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Analgesics & Pain">Analgesics & Pain</option>
                <option value="Anticoagulants">Anticoagulants</option>
                <option value="Neurological">Neurological</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
                <option value="General Formulary">General Formulary</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dosage Form & Strength</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tablet 10mg"
                value={form.dosageForm}
                onChange={(e) => setForm({ ...form, dosageForm: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity on Hand</label>
              <input
                type="number"
                className="form-input"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Safety Threshold Alert</label>
              <input
                type="number"
                className="form-input"
                value={form.minStockLevel}
                onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Dispensing Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Batch Expiration Date</label>
              <input
                type="date"
                className="form-input"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add to Formulary Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
