import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title, className = '' }: BottomSheetProps) {
  const controls = useAnimation();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      controls.start('visible');
    } else {
      document.body.style.overflow = 'auto';
      controls.start('hidden');
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, controls]);

  const handleDragEnd = (event: any, info: any) => {
    // If swiped down fast enough or dragged down far enough
    if (info.velocity.y > 200 || info.offset.y > 100) {
      onClose();
    } else {
      controls.start('visible');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial="hidden"
            animate={controls}
            exit="hidden"
            variants={{
              visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
              hidden: { y: '100%', transition: { type: 'spring', damping: 25, stiffness: 300 } }
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false} // Only allow dragging from the handle
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 z-[1000] flex max-h-[90dvh] flex-col overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-slate-950 shadow-2xl safe-pb ${className}`}
          >
            {/* Grab Handle Header */}
            <div 
              className="flex w-full cursor-grab items-center justify-center p-4 active:cursor-grabbing shrink-0 touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="h-1.5 w-12 rounded-full bg-white/20" />
            </div>

            {title && (
              <div className="px-6 pb-4">
                <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
              </div>
            )}

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
