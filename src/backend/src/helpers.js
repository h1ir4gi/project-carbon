

/**
 * 
 * Currently a nop, but may be needed later to setup ollama etc before starting server.
 */
const bootstrapServer = async () => {
  return await Promise.all([
    // do_blocking_setup_method()
  ]);

};

export {bootstrapServer};