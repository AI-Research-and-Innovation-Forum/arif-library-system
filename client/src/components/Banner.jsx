import React, { PureComponent } from 'react'

export class Banner extends PureComponent {
  render() {
    return (
      <>
        <div className="max-w-screen-2xl container mx-auto md-px-20 md:pl-16 md:pr-4 flex flex-col md:flex-row my-10 ">
          <div className="w-full order-2 md:w-1/2 md:order-1 mt-12 md:mt-32">
            <div className='space-y-12'>
              <h1 className='text-4xl font-bold'>Hello, welcome  here to learn something <span className='text-pink-500'>new everyday!!!</span></h1>
              <p className='text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum at maxime distinctio totam voluptatibus eligendi natus accusamus sit fuga velit, explicabo, sequi culpa laudantium, eos vel enim. Omnis illo possimus eveniet harum autem quo exercitationem accusantium?</p>
              <label className="input validator w-368 h-54 bg-white text-black border border-black dark:bg-slate-700 dark:text-white dark:border-gray-300">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                <input type="email" placeholder="mail@site.com" required className="bg-white text-black border-black border dark:bg-slate-700 dark:text-white dark:border-gray-300" />
              </label>

            </div>
            <button className="btn btn-secondary mt-4">Secondary</button>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>
          <div className=" order-1 w-full md:w-1/2">
            <img src="Banner.png" className='md:ml-36 md:mt-20' alt="" /></div>
        </div>
      </>

    )
  }
}

export default Banner
