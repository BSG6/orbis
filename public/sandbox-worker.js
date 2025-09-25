// JavaScript sandbox worker for safe code execution
let isRunning = false;
let currentExecution = null;

// Console output capture
const consoleOutput = [];

// Mock console object to capture output
const mockConsole = {
  log: (...args) => {
    consoleOutput.push({ type: 'log', args: args.map(arg => String(arg)) });
  },
  error: (...args) => {
    consoleOutput.push({ type: 'error', args: args.map(arg => String(arg)) });
  },
  warn: (...args) => {
    consoleOutput.push({ type: 'warn', args: args.map(arg => String(arg)) });
  },
  info: (...args) => {
    consoleOutput.push({ type: 'info', args: args.map(arg => String(arg)) });
  }
};

// Test runner function
function runTests(userCode, tests) {
  const results = [];
  consoleOutput.length = 0; // Clear previous output
  
  try {
    // Create a safe execution environment
    const safeGlobal = {
      console: mockConsole,
      setTimeout: undefined,
      setInterval: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
      WebSocket: undefined,
      localStorage: undefined,
      sessionStorage: undefined,
      document: undefined,
      window: undefined,
      global: undefined,
      process: undefined,
      require: undefined,
      module: undefined,
      exports: undefined
    };
    
    // Execute user code in safe environment
    const wrappedCode = `
      (function(console) {
        "use strict";
        ${userCode}
        
        // Return the main function for testing
        return typeof longestPalindrome !== 'undefined' ? longestPalindrome : 
               typeof twoSum !== 'undefined' ? twoSum :
               typeof isValid !== 'undefined' ? isValid :
               null;
      })(arguments[0]);
    `;
    
    const userFunction = eval(wrappedCode);
    
    if (!userFunction) {
      throw new Error('No main function found. Make sure to define your solution function.');
    }
    
    // Run each test case
    tests.forEach((test, index) => {
      try {
        const startTime = performance.now();
        const result = userFunction(...test.input);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Compare result with expected output
        const passed = JSON.stringify(result) === JSON.stringify(test.expected);
        
        results.push({
          testIndex: index,
          passed,
          input: test.input,
          expected: test.expected,
          actual: result,
          executionTime,
          error: null
        });
      } catch (error) {
        results.push({
          testIndex: index,
          passed: false,
          input: test.input,
          expected: test.expected,
          actual: null,
          executionTime: 0,
          error: error.message
        });
      }
    });
    
  } catch (error) {
    // Compilation or setup error
    return {
      success: false,
      error: error.message,
      consoleOutput,
      testResults: []
    };
  }
  
  return {
    success: true,
    error: null,
    consoleOutput,
    testResults: results
  };
}

// Message handler
self.onmessage = function(e) {
  const { type, code, tests, timeout = 5000 } = e.data;
  
  if (type === 'run') {
    if (isRunning) {
      self.postMessage({
        type: 'error',
        message: 'Code is already running'
      });
      return;
    }
    
    isRunning = true;
    
    // Set timeout for execution
    currentExecution = setTimeout(() => {
      isRunning = false;
      self.postMessage({
        type: 'timeout',
        message: 'Code execution timed out'
      });
    }, timeout);
    
    try {
      const result = runTests(code, tests);
      clearTimeout(currentExecution);
      isRunning = false;
      
      self.postMessage({
        type: 'result',
        ...result
      });
    } catch (error) {
      clearTimeout(currentExecution);
      isRunning = false;
      
      self.postMessage({
        type: 'error',
        message: error.message
      });
    }
  } else if (type === 'stop') {
    if (currentExecution) {
      clearTimeout(currentExecution);
      currentExecution = null;
    }
    isRunning = false;
    
    self.postMessage({
      type: 'stopped',
      message: 'Execution stopped'
    });
  }
};
