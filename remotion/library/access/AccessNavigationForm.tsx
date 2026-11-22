import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessNavigationFormProps {
  activeTab?: string;
  themeColor?: string;
}

export const AccessNavigationForm: React.FC<AccessNavigationFormProps> = (props) => {
  const {
    activeTab = "Orders Dashboard",
    themeColor = "#A4373A",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tabs = ['Customers', 'Orders Dashboard', 'Inventory Ledger', 'Executive Reports'];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      {/* Top Tab Bar */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #A4373A', paddingBottom: '0' }}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <div key={tab} style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: isActive ? 700 : 500,
              backgroundColor: isActive ? '#A4373A' : '#1e293b',
              color: isActive ? '#fff' : '#94a3b8',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
            }}>
              {tab}
            </div>
          );
        })}
      </div>

      {/* Main Tabbed Subform Canvas */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#A4373A' }}>{activeTab} Loaded</h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            Navigation subform container hosting live data controls with zero flicker.
          </p>
        </div>
      </div>
    </div>
  );
};
