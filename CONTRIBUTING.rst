============
Contributing
============

Contributions are always welcome.

Bug reports
===========

If you find a bug, please
`report it <https://github.com/iamthememory/biometrics-project.git/issues>`_
after checking that it isn't fixed in the latest ``develop`` branch code.

Make sure to include:

- Your operating system version
- Anything about your setup that might help find the issue
- Steps to reproduce the bug
- The error messages, if any

Feature requests
================

The best way to request a feature is to
`file a report <https://github.com/iamthememory/biometrics-project.git/issues>`_.

Make sure to explain the proposed feature in detail, and keep it as simple as
possible.

Development
===========

Setting up your environment
---------------------------

To set up your local development environment, do the following:

1.  `Install Python <https://www.python.org/>`_.

    You'll want to install at least Python 2.7 and Python 3.4.
    You probably want to add them to your PATH as well.
    Make sure you also install pip and setuptools.
    These are installed by default in the Windows builds of Python.
    For Linux systems, check your package manager.

2.  `Install Git <https://git-scm.com/>`_.

    On Windows, you want `Git for Windows <https://git-scm.com/download/win>`_.
    I recommend using Git BASH, rather than the GUI.
    Make sure you choose "Checkout Windows-style, commit Unix-style line
    endings" (``git config --global core.autocrlf true``) when you install Git
    for Windows.
    This step shouldn't be needed on other systems.

3.  `Install Gitflow <https://github.com/petervanderdoes/gitflow-avh>`_.

    If you installed Git for Windows, you already have this installed.

4.  Add the server certificates to Git.

    By default, Git doesn't accept our server certificate, unless you have the
    CACert root certificates installed (you probably don't).

    To fix that, first download `the CACert root bundle
    <http://wiki.cacert.org/FAQ?action=AttachFile&do=view&target=cacert-bundle.crt>`_.

    Then, to accept the certificates for the server, run::

        git config --global "http.https://maud.tenaisenma.com/.sslCAInfo" PATH_TO_DOWNLOADED_BUNDLE

5.  Install `tox <https://tox.readthedocs.org>`_.

    Tox helps us run numerous tests on our code.
    You can either install it with your package manager (if you have one), or by
    running ``pip install tox``.
    If you get an error about not being able to find ``pip``, you can try to run
    ``python -m pip install tox`` instead.

6.  Clone `the repository
    <https://github.com/iamthememory/biometrics-project.git>`_::

        git clone https://github.com/iamthememory/biometrics-project.git.git

7.  Set up the Gitflow scripts.

    Run ``git flow init`` in the repository to set up Git flow.
    The defaults should be correct, but for reference, here's an example run::

        /tmp/biometricsthing $ git flow init

        Which branch should be used for bringing forth production releases?
           - master
        Branch name for production releases: [master]
        Branch name for "next release" development: [develop]

        How to name your supporting branch prefixes?
        Feature branches? [feature/]
        Release branches? [release/]
        Hotfix branches? [hotfix/]
        Support branches? [support/]
        Version tag prefix? []
        Hooks and filters directory? [/tmp/biometricsthing/.git/hooks]

You should only have to do this once.

Making changes
--------------

To make changes, do the following:

1.  If you don't already have a feature branch for your change, do::

        git checkout develop
        git pull
        git flow feature start detailed-feature-name

    These commands checkout the development branch, pull the latest changes from
    the server, and create a new feature branch for you.

2.  If you've already made a feature branch, just do::

        git checkout feature/detailed-feature-name
        git pull

3.  For each of your changes, do the following:

    a.  Add your tests in the ``tests`` directory, if applicable.

    b.  Write your code, if applicable.

        Make sure you follow `PEP 8 <https://www.python.org/dev/peps/pep-0008>`_
        for your Python code, and `the Google docstring style
        <http://sphinxcontrib-napoleon.readthedocs.org/en/latest/example_google.html>`_
        for your docstrings.

    c.  Update any documentation you may need in the ``docs`` directory.

    d.  Run all the checks and tests with::

            tox

    e.  Add and commit your changes::

            git add file1 file2
            git commit             # This will open up your editor.

        Try to make one commit for each change you make.
        You may want to read up on `how to write good commit messages
        <http://chris.beams.io/posts/git-commit>`_.

4.  Add a note to ``CHANGELOG.rst`` about the changes.

5.  Make sure that you're in ``AUTHORS.rst``.

6.  Push your branch to the server by running::

        git flow feature publish detailed-feature-name

7.  `Open a new merge request on GitLab
    <https://github.com/iamthememory/biometrics-project.git/merge_requests>`_.
    Make sure the source branch is the one you were working on, and the target
    branch is ``develop``.
