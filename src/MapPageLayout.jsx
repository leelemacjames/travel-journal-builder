import React from 'react';

export default function MapPageLayout({
  page,
  pageIndex,
  viewMode,
  mapUrl,
  regionLabel,
  onNarrativeChange,
  onLocationNameChange,
  onAddLocation,
  onRemoveLocation,
  onPhotoUpload,
  onCaptionChange
}) {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl shadow-2xl border-8 border-amber-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative bg-white rounded-lg overflow-hidden shadow-xl" style={{ height: '420px' }}>
            {mapUrl ? (
              <img
                src={mapUrl}
                alt={regionLabel + ' map'}
                className="w-full h-full object-cover"
                style={{ filter: 'sepia(0.2) contrast(1.1)' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-700">
                No map selected
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                {page.locations.map((loc, i) => {
                  if (i < page.locations.length - 1) {
                    const next = page.locations[i + 1];
                    return (
                      <line
                        key={i}
                        x1={`${loc.x}%`}
                        y1={`${loc.y}%`}
                        x2={`${next.x}%`}
                        y2={`${next.y}%`}
                        stroke="#b91c1c"
                        strokeWidth="3"
                        strokeDasharray="8,5"
                      />
                    );
                  }
                  return null;
                })}
                {page.locations.map((loc, i) => (
                  <g key={i}>
                    <circle
                      cx={`${loc.x}%`}
                      cy={`${loc.y}%`}
                      r="7"
                      fill="#dc2626"
                      stroke="white"
                      strokeWidth="2.5"
                    />
                    <text
                      x={`${loc.x}%`}
                      y={`${loc.y - 3}%`}
                      textAnchor="middle"
                      style={{
                        fontSize: '10px',
                        fill: '#451a03',
                        paintOrder: 'stroke',
                        stroke: 'white',
                        strokeWidth: '3px'
                      }}
                    >
                      {loc.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="absolute bottom-4 right-4 w-16 h-16 bg-amber-50/95 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-800">
              <div className="relative w-full h-full flex items-center justify-center text-[10px] text-amber-900">
                <span className="absolute top-1 left-1 font-bold">N</span>
                <span className="absolute bottom-1 left-1 font-bold">S</span>
                <span className="absolute bottom-1 right-1 font-bold">E</span>
                <span className="absolute top-1 right-1 font-bold">W</span>
                <span className="text-lg">🧭</span>
              </div>
            </div>

            <div className="absolute top-3 left-3 bg-amber-50/95 px-3 py-1 rounded shadow border-l-4 border-amber-800 text-xs text-amber-900">
              <div className="uppercase tracking-wide font-semibold">Route Map</div>
              <div>{page.meta?.year || ''}</div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg p-5 shadow-xl border-t-4 border-amber-800"
            style={{ background: 'linear-gradient(to bottom, #fef3c7 0%, #fffbeb 100%)' }}
          >
            <h3 className="font-bold text-amber-900 mb-3 text-lg flex items-center gap-2">
              <span className="text-2xl">✏️</span> Travel Notes
            </h3>
            {viewMode ? (
              <div className="text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                {page.narrative}
              </div>
            ) : (
              <textarea
                value={page.narrative}
                onChange={(e) => onNarrativeChange(pageIndex, e.target.value)}
                className="w-full h-40 p-3 bg-white border-2 border-amber-300 rounded resize-none focus:border-amber-500 focus:outline-none text-sm leading-relaxed"
                placeholder="Write your story..."
                style={{ fontFamily: 'Georgia, serif' }}
              />
            )}
          </div>

          {!viewMode && (
            <div className="bg-white rounded-lg p-4 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <span className="text-lg">📍</span> Edit Locations
                </h3>
                <button
                  onClick={() => onAddLocation(pageIndex)}
                  className="px-2 py-1 bg-amber-900 text-white rounded text-xs hover:bg-amber-800"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {page.locations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={loc.name}
                      onChange={(e) => onLocationNameChange(pageIndex, i, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-amber-300 rounded"
                    />
                    <button
                      onClick={() => onRemoveLocation(pageIndex, i)}
                      className="px-1.5 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-amber-50/60 rounded-lg p-4 shadow-inner min-h-[420px]">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📸</span> Page Photos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {page.photos.map((photo, i) => (
              <div key={photo.id} className="bg-white rounded-lg shadow p-2 flex flex-col">
                <label className={viewMode ? 'block flex-1' : 'cursor-pointer block flex-1'}>
                  <div className="bg-amber-100 flex items-center justify-center overflow-hidden rounded h-36">
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-amber-600 text-2xl">📷</span>
                    )}
                  </div>
                  {!viewMode && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onPhotoUpload(pageIndex, i, e)}
                      className="hidden"
                    />
                  )}
                </label>
                {viewMode ? (
                  <div
                    className="text-[11px] text-center mt-1 text-amber-900"
                    style={{ fontFamily: 'Courier New, monospace' }}
                  >
                    {photo.caption}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => onCaptionChange(pageIndex, i, e.target.value)}
                    className="text-[11px] text-center mt-1 text-amber-900 bg-transparent border border-amber-200 rounded px-1 py-0.5 focus:outline-none"
                    style={{ fontFamily: 'Courier New, monospace' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
