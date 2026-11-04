/**
 * Export standalone, self-contained SVG diagram files.
 * Clones the SVG element, embeds required styles and attributes, and triggers browser download.
 */
export function exportSvgElement(svgElement: SVGSVGElement, filename: string): void {
  try {
    // Clone node so we don't mutate the DOM
    const clone = svgElement.cloneNode(true) as SVGSVGElement;

    // Set standard XML namespaces
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // Add inline self-contained styles for dark-mode SVG rendering outside browser
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = `
      text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
      .svg-bg { fill: #080B12; }
      .svg-node-bg { fill: #151D2B; stroke: #273248; stroke-width: 2; }
      .svg-node-active { fill: #1c273a; stroke: #7C5CFF; stroke-width: 2.5; }
      .svg-text-primary { fill: #F4F7FB; font-weight: 600; font-size: 14px; }
      .svg-text-secondary { fill: #9BA8BC; font-size: 11px; }
      .svg-edge { stroke: #7C5CFF; stroke-width: 2.2; fill: none; }
      .svg-edge-loop { stroke: #00D9FF; stroke-width: 2.2; stroke-dasharray: 6 4; fill: none; }
      .svg-badge { fill: #273248; }
      .svg-badge-text { fill: #00D9FF; font-size: 10px; font-weight: bold; }
    `;
    clone.insertBefore(styleEl, clone.firstChild);

    // Convert to XML string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clone);

    // Ensure XML declaration
    if (!svgString.startsWith('<?xml')) {
      svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
    }

    // Create blob and download link
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export SVG:', error);
  }
}
