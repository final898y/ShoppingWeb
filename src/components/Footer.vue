<template>
  <footer class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Aside -->
    <aside class="flex items-center gap-4">
      <svg
        width="50"
        height="50"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
        class="fill-current w-10 h-10 md:w-12 md:h-12"
      >
        <path
          d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
        ></path>
      </svg>
      <p class="text-sm md:text-base">
        Reddogs Industries Ltd.<br />Providing reliable tech since 1994
      </p>
    </aside>

    <!-- Nav: Services -->
    <nav class="hidden md:block">
      <h6 class="footer-title opacity-100">Services</h6>
      <a class="link link-hover block text-sm md:text-base">Branding</a>
      <a class="link link-hover block text-sm md:text-base">Design</a>
      <a class="link link-hover block text-sm md:text-base">Marketing</a>
      <a class="link link-hover block text-sm md:text-base">Advertisement</a>
    </nav>

    <!-- Nav: Company -->
    <nav class="hidden md:block">
      <h6 class="footer-title opacity-100">Company</h6>
      <a class="link link-hover block text-sm md:text-base">About us</a>
      <a class="link link-hover block text-sm md:text-base">Contact</a>
      <a class="link link-hover block text-sm md:text-base">Jobs</a>
      <a class="link link-hover block text-sm md:text-base">Press kit</a>
    </nav>

    <!-- Nav: Legal -->
    <nav class="block">
      <h6 class="footer-title opacity-100">Legal</h6>
      <a class="link link-hover block text-sm md:text-base">Terms of use</a>
      <a class="link link-hover block text-sm md:text-base">Privacy policy</a>
      <a class="link link-hover block text-sm md:text-base">Cookie policy</a>
    </nav>

    <!-- Form -->
    <form class="hidden md:flex flex-col gap-4">
      <h6 class="footer-title opacity-100">Newsletter</h6>
      <fieldset class="flex flex-col md:flex-row gap-2 w-full md:w-80">
        <label class="text-sm">Enter your email address</label>
        <div class="join flex flex-col md:flex-row w-full">
          <input
            type="text"
            placeholder="username@site.com"
            class="input input-bordered join-item w-full opacity-100"
          />
          <button class="btn btn-primary join-item mt-2 md:mt-0">
            Subscribe
          </button>
        </div>
      </fieldset>
    </form>
  </footer>
</template>

<script setup lang="ts"></script>
