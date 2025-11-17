import React from 'react';
import Draggable from 'react-draggable';

export default function CollageLayout({
  page,
  pageIndex,
  viewMode,
  onPhotoUpload,
  onCaptionChange,
  onPositionChange,
  onZIndexChange
}) {
  return (
    <div className="relative w-full min-h-[700px] bg-amber-50 rounded-xl shadow-2xl border-8 border-amber-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/lined-paper.png')"
        }}
      />

      <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded shadow border-l-4 border-amber-800 z-20">
        <div className="text-sm uppercase tracking-wide font-bold text-amber-900">
          Collage Layout
        </div>
        <div className="text-xs text-amber-700">
          {viewMode ? 'Render mode – editing disabled' : 'Drag photos · Use arrows to layer'}
        </div>
      </div>

      {page.photos.map((photo, i) => {
        const width =
          photo.size === 'large' ? 260 :
          photo.size === 'medium' ? 220 :
          180;
        const height =
          photo.size === 'large' ? 220 :
          photo.size === 'medium' ? 180 :
          140;

        return (
          <Draggable
            key={photo.id}
            disabled={viewMode}
            defaultPosition={{ x: photo.x || 0, y: photo.y || 0 }}
            onStop={(e, data) => onPositionChange(pageIndex, i, data.x, data.y)}
          >
            <div
              className="absolute bg-white p-3 shadow-2xl cursor-grab active:cursor-grabbing transition-all"
              style={{
                width,
                zIndex: photo.zIndex || 1,
                border: '8px solid #fefce8',
                boxShadow: '0 10px 24px rgba(0,0,0,0.35)'
              }}
            >
              <div
                className="relative"
                style={{
                  transform: `rotate(${photo.rotation || 0}deg)`,
                  transition: 'transform 0.2s'
                }}
              >
                {!viewMode && (
                  <div className="absolute -top-9 -right-9 flex flex-col gap-1 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onZIndexChange(pageIndex, i, 'up');
                      }}
                      className="bg-amber-800 text-white rounded-full p-1 hover:bg-amber-700 shadow-md text-[10px]"
                      title="Bring forward"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onZIndexChange(pageIndex, i, 'down');
                      }}
                      className="bg-amber-800 text-white rounded-full p-1 hover:bg-amber-700 shadow-md text-[10px]"
                      title="Send backward"
                    >
                      ↓
                    </button>
                  </div>
                )}

                <label className={viewMode ? 'block' : 'cursor-pointer block'}>
                  <div
                    className="bg-amber-100 flex items-center justify-center overflow-hidden rounded"
                    style={{
                      width: '100%',
                      height
                    }}
                  >
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-amber-600 text-3xl">📷</span>
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
                    className="w-full mt-1 text-xs text-center text-amber-900"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {photo.caption}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => onCaptionChange(pageIndex, i, e.target.value)}
                    className="w-full mt-1 text-xs text-center text-amber-900 bg-transparent border-none focus:outline-none"
                    style={{ fontFamily: 'Georgia, serif' }}
                  />
                )}
              </div>
            </div>
          </Draggable>
        );
      })}

      <div className="absolute bottom-6 left-6 -rotate-6 opacity-75 text-amber-900 text-4xl font-extrabold tracking-widest">
        TRAVEL
      </div>
      <div className="absolute bottom-4 right-8 rotate-12 opacity-60 text-amber-800 text-6xl font-black tracking-wider">
        ✈
      </div>
    </div>
  );
}
