declare namespace Express {
    interface Request {
      user?: { 
         id: string
         name: string
         pp_url :string 
         email: string 
      };
    }
  }