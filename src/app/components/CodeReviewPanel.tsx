import { motion } from 'motion/react';
import { FileCode, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const files = [
  { name: 'auth.service.ts', status: 'approved', lines: 142 },
  { name: 'oauth.middleware.ts', status: 'approved', lines: 89 },
  { name: 'token.utils.ts', status: 'review', lines: 56 },
  { name: 'auth.types.ts', status: 'approved', lines: 34 },
];

const codePreview = `export class AuthService {
  private tokenService: TokenService;

  async authenticate(credentials: Credentials) {
    // Validate input credentials
    const validated = await this.validateCredentials(credentials);
    
    // Generate OAuth2 tokens
    const tokens = await this.tokenService.generateTokens({
      userId: validated.userId,
      scope: validated.scope
    });
    
    return {
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      expiresIn: 3600
    };
  }
}`;

const aiComments = [
  { line: 6, text: 'Security: Rate limiting recommended', type: 'warning' },
  { line: 10, text: 'Approved: Token rotation implemented', type: 'success' },
];

export function CodeReviewPanel() {
  const [selectedFile, setSelectedFile] = useState(0);

  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl overflow-hidden"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
    >
      <div className="p-6 border-b border-black/10">
        <h3 className="text-[20px] font-[600] mb-1">Code Review</h3>
        <p className="text-[13px] text-black/60">AI-assisted code analysis</p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-black/10">
        {/* File List */}
        <div className="col-span-1 p-4">
          <div className="space-y-1">
            {files.map((file, index) => (
              <motion.button
                key={file.name}
                onClick={() => setSelectedFile(index)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                  transition-all duration-200
                  ${selectedFile === index ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]/50'}
                `}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{ x: 2 }}
              >
                <FileCode className="w-4 h-4 text-black/60 flex-shrink-0" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-[500] truncate">{file.name}</div>
                  <div className="text-[11px] text-black/40">{file.lines} lines</div>
                </div>
                {file.status === 'approved' && (
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" strokeWidth={1.5} />
                )}
                {file.status === 'review' && (
                  <AlertTriangle className="w-4 h-4 text-black flex-shrink-0" strokeWidth={1.5} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Code Preview */}
        <div className="col-span-2 p-6 bg-[#fafafa]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[13px] font-[600]">{files[selectedFile].name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-[600] px-2 py-1 bg-white rounded-full border border-black/10">
                TypeScript
              </span>
            </div>
          </div>

          {/* Code */}
          <div className="relative">
            <pre className="text-[13px] leading-relaxed font-mono overflow-x-auto">
              <code className="text-black/80">{codePreview}</code>
            </pre>

            {/* AI Comments */}
            {aiComments.map((comment, index) => (
              <motion.div
                key={index}
                className={`
                  absolute right-0 px-3 py-2 rounded-lg text-[11px] font-[500]
                  flex items-center gap-2 border
                  ${comment.type === 'warning' ? 'bg-white border-black/20' : 'bg-black text-white border-black'}
                `}
                style={{ top: `${comment.line * 24}px` }}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {comment.type === 'warning' ? (
                  <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                ) : (
                  <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                )}
                {comment.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
