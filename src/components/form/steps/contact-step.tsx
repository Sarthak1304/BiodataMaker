"use client";

import { Field, Input, Textarea } from "@/components/ui/input";
import { useDraftStore } from "@/lib/draft-store";

export function ContactStep() {
  const contact = useDraftStore((s) => s.draft.contact);
  const update = useDraftStore((s) => s.updateContact);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Field label="Mobile (+91)" className="flex-1">
          <Input placeholder="98765 43210" value={contact.phone} onChange={(e) => update({ phone: e.target.value })} />
        </Field>
        <Field label="WhatsApp" className="flex-1">
          <Input
            placeholder="Same as mobile"
            value={contact.whatsapp}
            onChange={(e) => update({ whatsapp: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Email">
        <Input type="email" value={contact.email} onChange={(e) => update({ email: e.target.value })} />
      </Field>
      <Field label="Address">
        <Textarea rows={2} value={contact.address} onChange={(e) => update({ address: e.target.value })} />
      </Field>
      <div className="flex gap-3">
        <Field label="City" className="flex-1">
          <Input value={contact.city} onChange={(e) => update({ city: e.target.value })} />
        </Field>
        <Field label="State" className="flex-1">
          <Input value={contact.state} onChange={(e) => update({ state: e.target.value })} />
        </Field>
      </div>
      <Field label="Instagram Handle (optional)">
        <Input
          placeholder="@yourhandle"
          value={contact.instagramHandle}
          onChange={(e) => update({ instagramHandle: e.target.value })}
        />
      </Field>
    </div>
  );
}
