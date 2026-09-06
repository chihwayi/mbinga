import { getSettings } from "@/actions/settings";
import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import ContactSettingsForm from "@/components/admin/ContactSettingsForm";

export default async function AdminSettings() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif text-white mb-2">Settings</h2>
        <p className="text-white/40 font-light">Configure your store preferences.</p>
      </div>

      <div className="flex flex-wrap gap-8">
        <ContactSettingsForm
          contactEmail={settings.contact_email}
          contactWhatsapp={settings.contact_whatsapp}
        />
        <PasswordChangeForm />
      </div>
    </div>
  );
}
