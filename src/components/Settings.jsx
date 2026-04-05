import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

/* ── Shared user state (in real app: context/zustand) ── */
export const DEFAULT_USER = {
  name: "Jeeya Dhiman",
  email: "jeeya@gmail.com",
  phone: "+91 98765 43210",
  currency: "INR",
  avatar: "JD",
  bio: "Finance enthusiast. Building wealth one rupee at a time. 🚀",
  location: "Mumbai, India",
  joinDate: "January 2025",
};

function Toggle({ value, onChange }) {
  return (
    <button
      className={`st-toggle${value ? " on" : ""}`}
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
    >
      <div className="st-toggle-knob" />
    </button>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, []);
  return <div className="st-toast">{msg}</div>;
}

export default function Settings() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);

  /* profile */
  const [profile, setProfile] = useState({ ...DEFAULT_USER });
  const [profileDraft, setProfileDraft] = useState({ ...DEFAULT_USER });

  /* notifications */
  const [notifs, setNotifs] = useState({
    budgetAlerts: true,
    weeklyReport: true,
    overspendAlert: true,
    newFeatures: false,
    marketingEmails: false,
    smsAlerts: false,
  });


  /* privacy */
  const [privacy, setPrivacy] = useState({
    twoFactor: false,
    activityLog: true,
    dataExport: false,
    publicProfile: false,
  });

  /* security */
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const showToast = (msg) => setToast(msg);

  const saveProfile = () => {
    setProfile({ ...profileDraft });
    showToast("✓ Profile updated successfully");
  };

  const savePassword = () => {
    if (!passwords.current) { setPwError("Enter current password"); return; }
    if (passwords.next.length < 8) { setPwError("New password must be 8+ characters"); return; }
    if (passwords.next !== passwords.confirm) { setPwError("Passwords don't match"); return; }
    setPwError("");
    setPasswords({ current: "", next: "", confirm: "" });
    showToast("✓ Password updated");
  };

  const ACCENT_COLORS = ["#22c55e","#22d3ee","#818cf8","#fb923c","#f472b6","#facc15","#f87171"];
  const FONT_SIZES    = ["small","medium","large"];

  const TABS = [
    { id: "profile",      label: "Profile",       icon: "👤" },
    { id: "notifications",label: "Notifications",  icon: "🔔" },
    { id: "security",     label: "Security",       icon: "🔐" },
    { id: "privacy",      label: "Privacy",        icon: "🛡️" },
    { id: "danger",       label: "Danger Zone",    icon: "⚠️" },
  ];

  return (
    <div className={`settings${visible ? " st-visible" : ""}`}>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* Header */}
      <div className="st-header st-fade" style={{ "--d": "0s" }}>
        <div>
          <p className="st-welcome">Welcome back 👋</p>
          <h1 className="st-h1">Settings</h1>
          <p className="st-sub">Manage your account, preferences and security</p>
        </div>
        <button className="st-profile-shortcut" onClick={() => navigate("/profile")}>
          <div className="st-mini-avatar">{profile.avatar}</div>
          <div>
            <div className="st-mini-name">{profile.name}</div>
            <div className="st-mini-link">View full profile →</div>
          </div>
        </button>
      </div>

      <div className="st-body st-fade" style={{ "--d": "0.1s" }}>
        {/* Sidebar tabs */}
        <div className="st-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`st-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="st-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="st-content">

          {/* ── PROFILE ── */}
          {activeTab === "profile" && (
            <div className="st-section">
              <div className="st-section-title">Profile Information</div>
              <div className="st-section-sub">Update your personal details</div>

              <div className="st-avatar-row">
                <div className="st-avatar-big">{profileDraft.avatar}</div>
                <div>
                  <div className="st-avatar-name">{profileDraft.name}</div>
                  <div className="st-avatar-email">{profileDraft.email}</div>
                  <button className="st-ghost-btn" onClick={() => showToast("📷 Avatar upload coming soon")}>
                    Change photo
                  </button>
                </div>
              </div>

              <div className="st-form-grid">
                <div className="st-field">
                  <label className="st-label">Full Name</label>
                  <input className="st-input" value={profileDraft.name}
                    onChange={e => setProfileDraft(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="st-field">
                  <label className="st-label">Email Address</label>
                  <input className="st-input" type="email" value={profileDraft.email}
                    onChange={e => setProfileDraft(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="st-field">
                  <label className="st-label">Phone Number</label>
                  <input className="st-input" value={profileDraft.phone}
                    onChange={e => setProfileDraft(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="st-field">
                  <label className="st-label">Location</label>
                  <input className="st-input" value={profileDraft.location}
                    onChange={e => setProfileDraft(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="st-field st-field-full">
                  <label className="st-label">Bio</label>
                  <textarea className="st-input st-textarea" value={profileDraft.bio}
                    onChange={e => setProfileDraft(p => ({ ...p, bio: e.target.value }))} />
                </div>
                <div className="st-field">
                  <label className="st-label">Currency</label>
                  <select className="st-input st-select" value={profileDraft.currency}
                    onChange={e => setProfileDraft(p => ({ ...p, currency: e.target.value }))}>
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                    <option value="GBP">£ British Pound (GBP)</option>
                  </select>
                </div>
              </div>

              <div className="st-actions">
                <button className="st-btn-ghost" onClick={() => setProfileDraft({ ...profile })}>Discard changes</button>
                <button className="st-btn-primary" onClick={saveProfile}>Save changes</button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div className="st-section">
              <div className="st-section-title">Notification Preferences</div>
              <div className="st-section-sub">Choose what you want to be notified about</div>

              <div className="st-notif-group">
                <div className="st-notif-group-label">Finance Alerts</div>
                {[
                  { key: "budgetAlerts",    label: "Budget limit alerts",      desc: "Get notified when approaching budget limits" },
                  { key: "overspendAlert",  label: "Overspend alerts",         desc: "Instant alert when a category goes over budget" },
                  { key: "weeklyReport",    label: "Weekly financial report",  desc: "Summary of your week every Sunday evening" },
                ].map(item => (
                  <div key={item.key} className="st-notif-row">
                    <div className="st-notif-info">
                      <span className="st-notif-label">{item.label}</span>
                      <span className="st-notif-desc">{item.desc}</span>
                    </div>
                    <Toggle value={notifs[item.key]} onChange={v => setNotifs(p => ({ ...p, [item.key]: v }))} />
                  </div>
                ))}
              </div>

              <div className="st-notif-group">
                <div className="st-notif-group-label">General</div>
                {[
                  { key: "newFeatures",      label: "New features & updates",   desc: "Learn about new FinFlow features" },
                  { key: "marketingEmails",  label: "Marketing emails",         desc: "Tips, offers and promotional content" },
                  { key: "smsAlerts",        label: "SMS alerts",               desc: "Receive critical alerts via SMS" },
                ].map(item => (
                  <div key={item.key} className="st-notif-row">
                    <div className="st-notif-info">
                      <span className="st-notif-label">{item.label}</span>
                      <span className="st-notif-desc">{item.desc}</span>
                    </div>
                    <Toggle value={notifs[item.key]} onChange={v => setNotifs(p => ({ ...p, [item.key]: v }))} />
                  </div>
                ))}
              </div>

              <div className="st-actions">
                <button className="st-btn-primary" onClick={() => showToast("✓ Notification preferences saved")}>Save preferences</button>
              </div>
            </div>
          )}


          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <div className="st-section">
              <div className="st-section-title">Security</div>
              <div className="st-section-sub">Keep your account safe and secure</div>

              <div className="st-security-card">
                <div className="st-sec-icon">🔑</div>
                <div className="st-sec-info">
                  <div className="st-sec-title">Change Password</div>
                  <div className="st-sec-desc">Use a strong password with 8+ characters</div>
                </div>
              </div>

              <div className="st-form-grid" style={{ marginTop: 16 }}>
                <div className="st-field st-field-full">
                  <label className="st-label">Current Password</label>
                  <input className="st-input" type="password" placeholder="••••••••"
                    value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className="st-field">
                  <label className="st-label">New Password</label>
                  <input className="st-input" type="password" placeholder="••••••••"
                    value={passwords.next} onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))} />
                </div>
                <div className="st-field">
                  <label className="st-label">Confirm New Password</label>
                  <input className="st-input" type="password" placeholder="••••••••"
                    value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                </div>
              </div>
              {pwError && <div className="st-pw-error">⚠️ {pwError}</div>}

              {passwords.next && (
                <div className="st-pw-strength">
                  <span className="st-pw-label">Strength:</span>
                  {["weak","fair","good","strong"].map((lvl, i) => (
                    <div key={lvl} className={`st-pw-bar${passwords.next.length > i * 3 + 2 ? " active" : ""}`}
                      style={{ background: ["#ef4444","#fb923c","#facc15","#4ade80"][i] }} />
                  ))}
                  <span className="st-pw-lvl" style={{ color: passwords.next.length >= 12 ? "#4ade80" : passwords.next.length >= 8 ? "#facc15" : "#ef4444" }}>
                    {passwords.next.length >= 12 ? "Strong" : passwords.next.length >= 8 ? "Good" : "Weak"}
                  </span>
                </div>
              )}

              <div className="st-actions" style={{ marginTop: 20 }}>
                <button className="st-btn-primary" onClick={savePassword}>Update password</button>
              </div>

              <div className="st-divider" />

              <div className="st-notif-row">
                <div className="st-notif-info">
                  <span className="st-notif-label">Two-factor authentication</span>
                  <span className="st-notif-desc">Add an extra layer of security to your account</span>
                </div>
                <Toggle value={privacy.twoFactor} onChange={v => { setPrivacy(p => ({ ...p, twoFactor: v })); showToast(v ? "✓ 2FA enabled" : "2FA disabled"); }} />
              </div>

              <div className="st-session-block">
                <div className="st-appear-label" style={{ marginBottom: 10 }}>Active Sessions</div>
                {[
                  { device: "Chrome on Windows", location: "Mumbai, IN", time: "Now — current", current: true },
                  { device: "Safari on iPhone",  location: "Mumbai, IN", time: "2 hours ago",   current: false },
                ].map((s, i) => (
                  <div key={i} className="st-session-row">
                    <div className="st-session-icon">{s.current ? "💻" : "📱"}</div>
                    <div className="st-session-info">
                      <span className="st-session-device">{s.device} {s.current && <span className="st-session-badge">Current</span>}</span>
                      <span className="st-session-meta">{s.location} · {s.time}</span>
                    </div>
                    {!s.current && <button className="st-ghost-btn st-revoke" onClick={() => showToast("✓ Session revoked")}>Revoke</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRIVACY ── */}
          {activeTab === "privacy" && (
            <div className="st-section">
              <div className="st-section-title">Privacy</div>
              <div className="st-section-sub">Control your data and visibility</div>

              {[
                { key: "activityLog",   label: "Activity logging",     desc: "Keep a log of your account actions" },
                { key: "publicProfile", label: "Public profile",        desc: "Allow others to find your profile" },
              ].map(item => (
                <div key={item.key} className="st-notif-row">
                  <div className="st-notif-info">
                    <span className="st-notif-label">{item.label}</span>
                    <span className="st-notif-desc">{item.desc}</span>
                  </div>
                  <Toggle value={privacy[item.key]} onChange={v => setPrivacy(p => ({ ...p, [item.key]: v }))} />
                </div>
              ))}

              <div className="st-divider" />

              <div className="st-appear-label">Data Management</div>
              <div className="st-data-btns">
                <button className="st-data-btn" onClick={() => showToast("📦 Preparing your data export...")}>
                  <span>📥</span> Export my data
                  <span className="st-data-desc">Download all your transactions and settings as JSON</span>
                </button>
                <button className="st-data-btn" onClick={() => showToast("🗑️ Activity log cleared")}>
                  <span>🗑️</span> Clear activity log
                  <span className="st-data-desc">Remove all stored activity history</span>
                </button>
              </div>
            </div>
          )}

          {/* ── DANGER ── */}
          {activeTab === "danger" && (
            <div className="st-section">
              <div className="st-section-title" style={{ color: "#f87171" }}>Danger Zone</div>
              <div className="st-section-sub">These actions are permanent and cannot be undone</div>

              <div className="st-danger-card">
                <div className="st-danger-info">
                  <div className="st-danger-title">Sign out of all devices</div>
                  <div className="st-danger-desc">Revoke all active sessions across all your devices</div>
                </div>
                <button className="st-btn-warning" onClick={() => showToast("✓ Signed out of all devices")}>Sign out all</button>
              </div>

              <div className="st-danger-card" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
                <div className="st-danger-info">
                  <div className="st-danger-title">Delete all transactions</div>
                  <div className="st-danger-desc">Permanently delete your entire transaction history</div>
                </div>
                <button className="st-btn-danger" onClick={() => { if (window.confirm("Delete ALL transactions? This cannot be undone.")) showToast("✓ All transactions deleted"); }}>Delete data</button>
              </div>

              <div className="st-danger-card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                <div className="st-danger-info">
                  <div className="st-danger-title">Delete account</div>
                  <div className="st-danger-desc">Permanently delete your FinFlow account and all associated data</div>
                </div>
                <button className="st-btn-danger" onClick={() => { if (window.confirm("Delete your account? This CANNOT be undone.")) showToast("Account deletion initiated"); }}>Delete account</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}