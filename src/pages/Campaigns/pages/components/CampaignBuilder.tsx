import NavbarBuilder from "./NavbarBuilder";
import { decode } from "html-entities";
import { useState } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {
  sortedSections: Section[];
  campaign: Campaign;
  slug: string;
  layout: Layout[];
};

type Devices = { desktop: string; tablet: string; mobile: string };
export type KeyDevices = keyof Devices;

const CampaignBuilder = ({ layout, slug, sortedSections, campaign }: Props) => {
  const [device, setDevice] = useState<keyof Devices>("desktop");

  const devices: Devices = {
    desktop: "1440px",
    tablet: "920px",
    mobile: "400px",
  };

  let html = "";
  for (const section of sortedSections) {
    const decode_html = section.content;
    const doc = new DOMParser().parseFromString(decode_html, "text/html");
    const section_layout = layout.find(
      (item) => item.sectionId === section.id
    )!;
    const renderOnLength = Object.keys(section_layout.renderOn).length;

    if (renderOnLength > 0) {
      // In case if selected slug has been disabled
      if (!section_layout.renderOn[slug]) {
        continue;
      }
    }

    for (const placeholder of section.placeholders) {
      const node = doc.querySelector(
        `[data-template-it_id='${placeholder.id}']`
      );
      if (!node) continue;

      let text = "";
      if (!(section.id in campaign.data)) {
        text += placeholder.fallback;
      } else {
        const campaign_data = campaign.data[section.id];
        // In case of section has different amounts of slugs
        if (!(slug in campaign_data[placeholder.id])) {
          text = placeholder.fallback;
        }

        text = campaign_data[placeholder.id][slug];
      }
      node.insertAdjacentText("beforebegin", text);
      node.remove();
    }

    html += doc.body.innerHTML;
  }

  if (!campaign.data) {
    return (
      <div className="w-full flex items-center justify-center flex-col text-md font-semibold text-center md:text-3xl">
        Looks like you don't have data <br /> to render.
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden flex flex-col gap-2 relative bg-slate-50 p-2">

      <div className="grow">
        <TransformWrapper
          smooth={true}
          minScale={0.5}
          maxScale={1.5}
          initialScale={1}>
          <NavbarBuilder
            setDevice={(device: KeyDevices) => setDevice(device)}
            html={decode(html)}
            campaign={campaign}
          />
          <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
            <iframe
              style={{ width: devices[device] }}
              srcDoc={decode(html)}
              className="h-full pointer-events-none"
            ></iframe>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div >
  );
};

export default CampaignBuilder;
