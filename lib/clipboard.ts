/**
 * 跨浏览器复制文本到剪贴板
 * 支持现代浏览器的 Clipboard API 和旧浏览器的 execCommand 降级
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 检查是否为空文本
  if (!text || typeof text !== 'string') {
    console.error('Invalid text for clipboard copy');
    return false;
  }

  try {
    // 方案1: 现代 Clipboard API (优先)
    // 检查是否支持且在安全上下文中
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (clipboardError) {
        console.warn('Clipboard API failed:', clipboardError);
        // 降级到 execCommand
      }
    }

    // 方案2: 降级到 execCommand (Safari 和旧浏览器)
    return copyTextFallback(text);
  } catch (error) {
    console.error('All copy methods failed:', error);
    return false;
  }
}

/**
 * 使用 execCommand 的降级复制方案
 * 特别优化 Safari 兼容性
 */
function copyTextFallback(text: string): boolean {
  try {
    // Safari 需要用户能够"看到"要复制的元素，即使它实际上是不可见的
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 针对 Safari 的特殊样式设置
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.fontSize = '16px'; // 防止 Safari 缩放
    textArea.style.zIndex = '-1000';
    
    // 添加到DOM
    document.body.appendChild(textArea);
    
    // 获得焦点并选中所有文本
    textArea.focus();
    textArea.select();
    
    // Safari 需要 setSelectionRange
    if (textArea.setSelectionRange) {
      textArea.setSelectionRange(0, text.length);
    }
    
    // 尝试复制
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (execError) {
      console.warn('execCommand copy failed:', execError);
    }
    
    // 清理
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy method failed:', error);
    return false;
  }
}

/**
 * 检查浏览器是否支持剪贴板操作
 */
export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.('copy') ||
    document.execCommand
  );
}

/**
 * 获取剪贴板支持的调试信息
 */
export function getClipboardDebugInfo(): {
  hasClipboardAPI: boolean;
  isSecureContext: boolean;
  hasExecCommand: boolean;
  userAgent: string;
} {
  return {
    hasClipboardAPI: !!navigator.clipboard,
    isSecureContext: !!window.isSecureContext,
    hasExecCommand: !!document.execCommand,
    userAgent: navigator.userAgent,
  };
}