import { ArrowLeft, FileText, Shield } from "lucide-react";

interface ViewProps {
  onBack: () => void;
}

export function PrivacyView({ onBack }: ViewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted hover:text-accentText transition-colors"
      >
        <ArrowLeft size={16} /> Back to Tool
      </button>
      <div className="prose prose-invert max-w-none">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Shield className="text-accent" /> Privacy Policy
        </h2>
        <p className="text-lg text-foreground/80 mb-8">
          At OptiImage Local, we take your privacy seriously. In fact, it&apos;s
          the core feature of our application.
        </p>

        <div className="grid gap-8">
          <div className="bg-surface/50 p-6 rounded-xl border border-border">
            <h3 className="text-xl font-semibold text-white mb-3">
              No Server Uploads
            </h3>
            <p className="text-muted">
              Unlike other online tools,{" "}
              <strong>your images never leave your device</strong>. We do not
              have servers that process your files. When you drop an image into
              OptiImage Local, the code runs entirely within your web browser
              (Client-Side).
            </p>
          </div>

          <div className="bg-surface/50 p-6 rounded-xl border border-border">
            <h3 className="text-xl font-semibold text-white mb-3">
              No Data Collection
            </h3>
            <p className="text-muted">
              We do not collect, store, or share any personal information. We do
              not track the content of your images, their metadata, or your
              usage patterns. There are no user accounts, and no cookies are
              used for tracking purposes.
            </p>
          </div>

          <div className="bg-surface/50 p-6 rounded-xl border border-border">
            <h3 className="text-xl font-semibold text-white mb-3">
              Local Processing
            </h3>
            <p className="text-muted">
              All image compression, resizing, and conversion is performed using
              your computer&apos;s own processing power via WebAssembly and
              HTML5 Canvas technologies. This ensures maximum security for
              sensitive photos or documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TermsView({ onBack }: ViewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted hover:text-accentText transition-colors"
      >
        <ArrowLeft size={16} /> Back to Tool
      </button>
      <div className="prose prose-invert max-w-none">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <FileText className="text-accent" /> Terms of Service
        </h2>

        <div className="space-y-8 text-foreground/80">
          <section>
            <h3 className="text-xl font-semibold text-white mb-2">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using OptiImage Local, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2">
              2. Description of Service
            </h3>
            <p>
              OptiImage Local provides a browser-based image optimization tool.
              The service is provided free of charge and operates locally on
              your device.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2">
              3. Disclaimer of Warranties
            </h3>
            <div className="bg-surface/50 p-4 rounded-lg border border-border text-muted text-sm italic">
              &quot;THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY
              KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
              AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.&quot;
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2">
              4. User Responsibility
            </h3>
            <p>
              You are solely responsible for the content of the images you
              process. Since we do not host or view your files, we cannot be
              held responsible for any data loss or corruption that might occur
              during local processing, though we strive to ensure the tool is
              safe and stable.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2">
              5. Changes to Terms
            </h3>
            <p>
              We reserve the right to update these terms at any time without
              notice. Your continued use of the service constitutes acceptance
              of any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
