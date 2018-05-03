Overview
========

Tests
-----

In order to run the tests, first do ::

    $ pip install tox

or ::

    $ python -m pip install tox

If you are on a \*nix system, you can use ``pip install --user tox`` to install
to ``~/.local/``, which means you have to add ``~/.local/bin`` to your ``PATH``,
or you can use ``sudo pip install tox`` to install it globally, although this is
not recommended.
If you do wish to install tox system-wide on a \*nix system, please first check
if your package manager can install it first.

If you do not have pip (which Python has for some time installed by default),
you can install it from your package manager, or by following the instructions
on `Pip's install page <https://pip.pypa.io/en/latest/installing.html>`_.

Once you have tox installed, do ::

    $ tox

from the root of the project directory.

Tox will then load any dependencies it needs to run the tests, and run them.
That's all you need to do to run the test suite against all the versions of
Python that tox can find, generate coverage statistics, and print it in a nice,
colorful format (in most cases).
It also reads through docstrings and doctests the examples given there, too.

It will also build HTML documentation in the ``dist/docs`` directory.

You can still run the test modules in ``test/`` directly, however.

Installation
------------

In order to install, you can use ::

    $ pip install DIRECTORY

where ``DIRECTORY`` is the root directory of this project.
Adding the ``--user`` flag does the same thing as described previously, in the
Tests section.

In order to avoid polluting the environment with temporarily installed packages,
however, we recommend using `virtualenv
<https://virtualenv.pypa.io/en/latest/index.html>`_, which allows installing
packages into their own local, and possibly temporary, trees.

To install virtualenv and create a virtual environment for running installing
and testing out this project, do ::

    $ pip install virtualenv
    $ virtualenv exampleenv

The virtual environment can be activated (which automatically modifies the
system and Python PATHs), by the following.

On \*nix ::

    $ source exampleenv/bin/activate

On Windows ::

    $ \path\to\exampleenv\Scripts\activate

You can then use the installed packages, modules, and scripts normally.

To go back to your original settings, do ::

    $ deactivate

Credits
-------

Portions of ``setup.py`` are from the tox documentation examples on integrating
tox with setuptools.
