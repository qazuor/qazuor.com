/**
 * Example component demonstrating Tailwind CSS animations
 * Uses tailwindcss-animate plugin for pre-built animations
 */
export function TailwindAnimations() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold mb-6">Tailwind Animations</h2>

      {/* Fade in animation */}
      <div className="animate-in fade-in duration-1000">
        <div className="p-6 bg-primary/20 rounded-lg">
          <h3 className="font-semibold mb-2">Fade In</h3>
          <p className="text-sm">This element fades in on load</p>
        </div>
      </div>

      {/* Slide in from bottom */}
      <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="p-6 bg-secondary/20 rounded-lg">
          <h3 className="font-semibold mb-2">Slide In</h3>
          <p className="text-sm">This element slides in from the bottom</p>
        </div>
      </div>

      {/* Hover animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          className="p-6 bg-accent/20 rounded-lg transition-transform hover:scale-105 active:scale-95"
        >
          <h3 className="font-semibold">Hover Scale</h3>
          <p className="text-sm mt-2">Hover me!</p>
        </button>

        <button
          type="button"
          className="p-6 bg-accent/20 rounded-lg transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <h3 className="font-semibold">Hover Lift</h3>
          <p className="text-sm mt-2">Hover me!</p>
        </button>

        <button
          type="button"
          className="p-6 bg-orange-100 dark:bg-orange-900 rounded-lg transition-colors hover:bg-orange-200 dark:hover:bg-orange-800"
        >
          <h3 className="font-semibold">Hover Color</h3>
          <p className="text-sm mt-2">Hover me!</p>
        </button>
      </div>
    </div>
  );
}
